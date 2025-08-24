import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  }, { tableName: 'ratings', indexes: [{ unique: true, fields: ['userId', 'storeId'] }] });
  return Rating;
};
