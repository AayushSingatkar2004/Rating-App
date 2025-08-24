import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { User, Role, Store, Rating } from '../models/index.js';
import { validationResult, body, query } from 'express-validator';
import { emailRule, passwordRule, nameRule, addressRule, paginationRules } from '../utils/validators.js';
import bcrypt from 'bcryptjs';
import { Op, fn, col, literal } from 'sequelize';

const router = Router();

router.use(auth, requireRole('ADMIN'));

// Metrics: total users, stores, ratings
router.get('/metrics', async (req, res) => {
  const users = await User.count();
  const stores = await Store.count();
  const ratings = await Rating.count();
  res.json({ users, stores, ratings });
});

// Create user (admin or normal or owner)
router.post('/users', [nameRule, emailRule, addressRule, passwordRule, body('role').isIn(['ADMIN','USER','OWNER'])], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password, role } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already exists' });
  const roleRow = await Role.findOne({ where: { name: role.toUpperCase() } });
  console.log(roleRow)
  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
  const user = await User.create({ name, email, address, passwordHash, roleId: roleRow.id });
  res.json({ id: user.id });
});

// List users with filters/sort
router.get('/users', [
  ...paginationRules,
  query('name').optional().isString(),
  query('email').optional().isString(),
  query('address').optional().isString(),
  query('role').optional().isIn(['ADMIN','USER','OWNER'])
], async (req, res) => {
  const { page=1, limit=10, sortBy='name', order='asc', name, email, address, role } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  const include = [{ model: Role, required: false }];
  if (role) include[0].where = { name: role, };

  const { rows, count } = await User.findAndCountAll({
    where,
    include,
    order: sortBy === 'role'
  ? [[Role, 'name', order.toUpperCase()]]
  : [[sortBy, order.toUpperCase()]],
    offset: (page-1)*limit,
    limit: Number(limit)
  });

  const data = rows.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.Role.name }));
  res.json({ data, total: count });
});

// View user details (with rating if owner)
router.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: Role });
  if (!user) return res.status(404).json({ message: 'Not found' });
  let ownerRating = null;
  if (user.Role.name === 'OWNER') {
    const stores = await Store.findAll({ where: { ownerId: user.id } });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length) {
      const row = await Rating.findOne({
        attributes: [[fn('AVG', col('rating')), 'avg']],
        where: { storeId: storeIds }
      });
      ownerRating = row?.get('avg') ? Number(row.get('avg')).toFixed(2) : null;
    }
  }
  res.json({ id: user.id, name: user.name, email: user.email, address: user.address, role: user.Role.name, rating: ownerRating });
});

// Create store
// Create store (Admin only)
router.post('/stores', [
  body('name').isLength({ min: 1 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Invalid store email'),
  body('address').isLength({ max: 400 }),
  body('ownerId').optional({ nullable: true }).isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, ownerId } = req.body;

  // Ensure owner exists & has OWNER role
  if (ownerId) {
    const owner = await User.findByPk(ownerId, { include: Role });
    if (!owner || owner.Role.name !== "OWNER") {
      return res.status(400).json({ message: "Invalid ownerId" });
    }
  }

  const store = await Store.create({ name, email, address, ownerId });
  res.json({ id: store.id, message: "Store created successfully" });
});


// List stores (admin view) with rating avg, filters, sort
// List stores (admin view) with rating avg, filters, sort
router.get('/stores', [
  ...paginationRules,
  query('name').optional().isString(),
  query('email').optional().isString(),
  query('address').optional().isString(),
], async (req, res) => {
  try {
    const { page=1, limit=10, sortBy='name', order='asc', name, email, address } = req.query;

    const where = {};
    if (name?.trim())    where.name    = { [Op.like]: `%${name}%` };
    if (email?.trim())   where.email   = { [Op.like]: `%${email}%` };
    if (address?.trim()) where.address = { [Op.like]: `%${address}%` };

    const validSort = ['id','name','email','address','rating'];
    const sortField = validSort.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // ✅ Get stores with avgRating
    const rows = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: {
        include: [
          [fn('COALESCE', fn('AVG', col('ratings.rating')), 0), 'avgRating']
        ]
      },
      group: ['Store.id'],
      order: sortField === 'rating'
        ? [[literal('avgRating'), sortOrder]]
        : [[sortField, sortOrder]],
      offset: (page - 1) * limit,
      limit: Number(limit),
      subQuery: false  // prevents wrong pagination with group
    });

    // ✅ Separate count (without group)
    const total = await Store.count({ where });

    const data = rows.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: s.get('avgRating') ? Number(s.get('avgRating')).toFixed(2) : null
    }));

    res.json({ data, total });
  } catch (err) {
    console.error('Error in GET /api/admin/stores:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// router.post("/add-store", auth, async (req, res) => {
//   if (req.user.role !== "ADMIN") {
//     return res.status(403).json({ error: "Only owners can add stores" });
//   }

//   const { name, address } = req.body;

//   const newStore = await Store.create({
//     name,
//     address,
//     ownerId: req.user.id
//   });

//   res.json({ message: "Store added successfully", store: newStore });
// });

export default router;
