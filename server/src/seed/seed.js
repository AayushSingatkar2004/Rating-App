import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, Role, User, Store } from '../models/index.js';

const run = async () => {
  await initDb();
  // Roles
  const roles = ['ADMIN','USER','OWNER'];
  for (const r of roles) await Role.findOrCreate({ where: { name: r }, defaults: { name: r } });

  // Admin
  const adminEmail = 'admin@sys.com';
  const adminExists = await User.findOne({ where: { email: adminEmail } });
  if (!adminExists) {
    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
    const passwordHash = await bcrypt.hash('Admin@123', Number(process.env.BCRYPT_SALT_ROUNDS));
    await User.create({
      name: 'System Administrator Default User',
      email: adminEmail,
      address: 'HQ',
      passwordHash,
      roleId: adminRole.id,
    });
    console.log('Seeded admin: admin@sys.com / Admin@123');
  }

  // Example Owner + Store
  const ownerRole = await Role.findOne({ where: { name: 'OWNER' } });
  const ownerEmail = 'owner@shop.com';
  let owner = await User.findOne({ where: { email: ownerEmail } });
  if (!owner) {
    const passwordHash = await bcrypt.hash('Owner@123', Number(process.env.BCRYPT_SALT_ROUNDS));
    owner = await User.create({
      name: 'Example Store Owner Account',
      email: ownerEmail,
      address: 'Owner Street 1',
      passwordHash,
      roleId: ownerRole.id,
    });
  }
  await Store.findOrCreate({ where: { name: 'Sample Store' }, defaults: { name: 'Sample Store', email: 'store@example.com', address: '123 Market Road', ownerId: owner.id } });

  process.exit(0);
};

run();
