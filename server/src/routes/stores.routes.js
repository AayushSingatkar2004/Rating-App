import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { Store, Rating } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import { body, query, validationResult } from 'express-validator';
import { paginationRules } from '../utils/validators.js';

const router = Router();

// All endpoints below are for Normal Users
router.use(auth, requireRole('USER'));

// GET /api/stores  -> list with overallRating + myRating (for logged-in user)
// GET /api/stores  -> list with overallRating + myRating (for logged-in user)
router.get('/', [
  ...paginationRules,
  query('name').optional().isString(),
  query('address').optional().isString(),
  query('sortBy').optional().isString(),
  query('order').optional().isString(),
], async (req, res) => {
  try {
    const userId = req.user.id;
    const { page=1, limit=10, sortBy='name', order='asc', name, address } = req.query;

    const where = {};
    if (name?.trim())    where.name    = { [Op.like]: `%${name}%` };
    if (address?.trim()) where.address = { [Op.like]: `%${address}%` };

    const validSort = ['id','name','address','overallRating'];
    const sortField = validSort.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // fetch stores with avg rating
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'overallRating']]
      },
      group: ['Store.id'],
      order: sortField === 'overallRating'
        ? [[literal('overallRating'), sortOrder]]
        : [[sortField, sortOrder]],
      offset: (page - 1) * limit,
      limit: Number(limit),
      subQuery: false
    });

    // total count without group
    const total = await Store.count({ where });

    // get all my ratings in one query
    const myRatingsRows = await Rating.findAll({
      where: { userId },
      attributes: ['storeId','rating']
    });
    const myRatings = new Map(myRatingsRows.map(r => [r.storeId, r.rating]));

    const data = stores.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: s.get('overallRating')
        ? Number(s.get('overallRating')).toFixed(2)
        : null,
      myRating: myRatings.get(s.id) ?? null
    }));

    res.json({ data, total });
  } catch (err) {
    console.error('Error in GET /api/stores:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// POST /api/stores/:id/rating  -> create or update rating (1..5)
router.post('/:id/rating', [
  body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const storeId = Number(req.params.id);
  const userId = req.user.id;
  const { rating } = req.body;

  const store = await Store.findByPk(storeId);
  if (!store) return res.status(404).json({ message: 'Store not found' });

  const [row, created] = await Rating.findOrCreate({
    where: { userId, storeId },
    defaults: { rating }
  });
  if (!created) {
    row.rating = rating;
    await row.save();
  }
  res.json({ ok: true });
});

export default router;
