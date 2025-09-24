module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    student_id: DataTypes.STRING,
    status: DataTypes.STRING,
    created_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    profile_image_url: DataTypes.STRING,
  }, { tableName: "USERS", timestamps: false });
};
