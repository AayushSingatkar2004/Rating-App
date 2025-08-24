import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: true },
    address: { type: DataTypes.STRING(400), allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
  }, { tableName: 'stores' });
  return Store;
};
