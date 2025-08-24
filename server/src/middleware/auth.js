import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, { include: Role });
    if (!user) return res.status(401).json({ message: 'Invalid user' });
    req.user = { id: user.id, role: user.Role?.name };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
