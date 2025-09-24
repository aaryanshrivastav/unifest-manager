module.exports = (sequelize, DataTypes) => {
  return sequelize.define("UserRole", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    role_id: { type: DataTypes.INTEGER, primaryKey: true },
    assigned_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    assigned_by: DataTypes.INTEGER,
    expiry_date: DataTypes.DATE,
    status: DataTypes.STRING,
  }, { tableName: "USER_ROLES", timestamps: false });
};
