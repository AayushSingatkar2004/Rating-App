import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  }, { tableName: 'roles' });
  return Role;
};
