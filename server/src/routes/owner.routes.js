import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { Store, Rating, User } from '../models/index.js';
import { fn, col } from 'sequelize';

const router = Router();
router.use(auth, requireRole('OWNER'));

// GET /api/owner/dashboard
router.get('/dashboard', async (req, res) => {
  const ownerId = req.user.id;
  const stores = await Store.findAll({ where: { ownerId } });

  const payload = [];
  for (const s of stores) {
    const ratings = await Rating.findAll({
      where: { storeId: s.id },
      include: [{ model: User, attributes: ['id','name','email'] }]
    });
    const avgRow = await Rating.findOne({
      attributes: [[fn('AVG', col('rating')), 'avg']],
      where: { storeId: s.id }
    });
    payload.push({
      store: { id: s.id, name: s.name },
      average: avgRow?.get('avg') ? Number(avgRow.get('avg')).toFixed(2) : null,
      raters: ratings.map(r => ({
        userId: r.userId,
        name: r.User.name,
        email: r.User.email,
        rating: r.rating
      }))
    });
  }
  res.json(payload);
});

// routes/store.js
router.post("/add-store", auth, async (req, res) => {
  if (req.user.role !== "OWNER") {
    return res.status(403).json({ error: "Only owners can add stores" });
  }

  const { name, address } = req.body;

  const newStore = await Store.create({
    name,
    address,
    ownerId: req.user.id
  });

  res.json({ message: "Store added successfully", store: newStore });
});


export default router;
