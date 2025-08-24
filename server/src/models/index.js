import { sequelize } from '../config/db.js';
import RoleModel from './Role.js';
import UserModel from './User.js';
import StoreModel from './Store.js';
import RatingModel from './Rating.js';

export const Role = RoleModel(sequelize);
export const User = UserModel(sequelize);
export const Store = StoreModel(sequelize);
export const Rating = RatingModel(sequelize);

// Relations
// in models/index.js
// User.belongsTo(Role, { foreignKey: 'roleId' });
// Role.hasMany(User, { foreignKey: 'roleId' });

// Relations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

// Many-to-Many through Rating (user rates store)
User.belongsToMany(Store, { through: Rating, foreignKey: 'userId', otherKey: 'storeId' });
Store.belongsToMany(User, { through: Rating, foreignKey: 'storeId', otherKey: 'userId' });

// Direct associations for eager loading
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId' });


export const initDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};
