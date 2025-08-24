import { Router } from 'express';
import { emailRule, passwordRule, nameRule, addressRule } from '../utils/validators.js';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Normal User Signup
// router.post('/signup', [nameRule, emailRule, addressRule, passwordRule], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//   const { name, email, address, password } = req.body;
//   const existing = await User.findOne({ where: { email } });
//   if (existing) return res.status(400).json({ message: 'Email already registered' });
//   const role = await Role.findOne({ where: { name: 'USER' } });
//   const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
//   const user = await User.create({ name, email, address, passwordHash, roleId: role.id });
//   return res.json({ id: user.id });
// });

// Signup (User or Owner)
router.post('/signup', [
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  body('role').optional().isIn(['USER','OWNER'])  // only allow USER/OWNER
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, password, role } = req.body;

  // check duplicate email
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  // default role = USER if not provided
  const roleName = role || 'USER';

  // fetch from Role table
  const roleRow = await Role.findOne({ where: { name: roleName } });
  if (!roleRow) return res.status(500).json({ message: 'Role not found in DB. Did you seed roles?' });

  // hash password
  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));

  // create user
  const user = await User.create({
    name,
    email,
    address,
    passwordHash,
    roleId: roleRow.id
  });

  return res.json({
    id: user.id,
    name: user.name,
    role: roleName
  });
});


// Login (all roles)
router.post('/login', [emailRule, body('password').isString()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return res.json({ token, role: user.Role.name, name: user.name });
});

// Change password (logged in)
router.put('/password', auth, [
  body('oldPassword').isString(),
  passwordRule,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, password } = req.body;
  const user = await User.findByPk(req.user.id);
  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
  user.passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
  await user.save();
  return res.json({ message: 'Password updated' });
});

export default router;
