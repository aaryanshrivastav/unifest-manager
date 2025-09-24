module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EventRegistration", {
    registration_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    registration_type: DataTypes.STRING,
    team_name: DataTypes.STRING,
    registration_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    attendance_status: DataTypes.STRING,
    check_in_time: DataTypes.DATE,
    performance_score: DataTypes.DECIMAL,
    qr_code: DataTypes.STRING,
  }, { tableName: "EVENT_REGISTRATIONS", timestamps: false });
};
