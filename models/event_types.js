module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EventType", {
    type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type_name: DataTypes.STRING,
    description: DataTypes.STRING,
    default_duration: DataTypes.INTEGER,
  }, { tableName: "EVENT_TYPES", timestamps: false });
};
