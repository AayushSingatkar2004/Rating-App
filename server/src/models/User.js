import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    address: { type: DataTypes.STRING(400), allowNull: true },
    passwordHash: { type: DataTypes.STRING(200), allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'users' });
  return User;
};
