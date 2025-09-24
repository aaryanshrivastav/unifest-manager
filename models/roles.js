module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Role", {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: DataTypes.STRING,
    role_description: DataTypes.STRING,
    is_system_role: DataTypes.BOOLEAN,
    created_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: "ROLES", timestamps: false });
};
