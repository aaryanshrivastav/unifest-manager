module.exports = (sequelize, DataTypes) => {
  return sequelize.define("VolunteerRole", {
    volunteer_role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: DataTypes.STRING,
    role_description: DataTypes.STRING,
    required_skills: DataTypes.STRING,
    time_commitment_hours: DataTypes.INTEGER,
    benefits: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
  }, { tableName: "VOLUNTEER_ROLES", timestamps: false });
};
