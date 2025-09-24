module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Permission", {
    permission_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    permission_name: DataTypes.STRING,
    permission_category: DataTypes.STRING,
    description: DataTypes.STRING,
  }, { tableName: "PERMISSIONS", timestamps: false });
};
