module.exports = (sequelize, DataTypes) => {
  return sequelize.define("VolunteerApplication", {
    application_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    volunteer_role_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    application_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: DataTypes.STRING,
    skills: DataTypes.STRING,
    availability: DataTypes.STRING,
    reviewed_by: DataTypes.INTEGER,
  }, { tableName: "VOLUNTEER_APPLICATIONS", timestamps: false });
};
