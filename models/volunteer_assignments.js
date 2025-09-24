module.exports = (sequelize, DataTypes) => {
  return sequelize.define("VolunteerAssignment", {
    assignment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    volunteer_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    volunteer_role_id: DataTypes.INTEGER,
    shift_start: DataTypes.DATE,
    shift_end: DataTypes.DATE,
    assignment_status: DataTypes.STRING,
    performance_rating: DataTypes.STRING,
    hours_worked: DataTypes.INTEGER,
  }, { tableName: "VOLUNTEER_ASSIGNMENTS", timestamps: false });
};
