module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Event", {
    event_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_code: DataTypes.STRING,
    event_name: DataTypes.STRING,
    event_description: DataTypes.TEXT,
    start_datetime: DataTypes.DATE,
    end_datetime: DataTypes.DATE,
    registration_start: DataTypes.DATE,
    registration_end: DataTypes.DATE,
    max_participants: DataTypes.INTEGER,
    registration_fee: DataTypes.DECIMAL,
    coordinator_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    approval_status: DataTypes.STRING,
  }, { tableName: "EVENTS", timestamps: false });
};
