module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Venue", {
    venue_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    venue_name: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    location: DataTypes.STRING,
    facilities: DataTypes.STRING,
    availability_status: DataTypes.STRING,
  }, { tableName: "VENUES", timestamps: false });
};
