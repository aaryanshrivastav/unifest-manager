const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "oracle",
    logging: false,
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = require("./users")(sequelize, Sequelize.DataTypes);
db.Event = require("./events")(sequelize, Sequelize.DataTypes);
db.Role = require("./roles")(sequelize, Sequelize.DataTypes);
db.UserRole = require("./user_roles")(sequelize, Sequelize.DataTypes);
db.Permission = require("./permissions")(sequelize, Sequelize.DataTypes);
db.EventRegistration = require("./event_registrations")(sequelize, Sequelize.DataTypes);
db.EventType = require("./event_types")(sequelize, Sequelize.DataTypes);
db.Venue = require("./venues")(sequelize, Sequelize.DataTypes);
db.VolunteerRole = require("./volunteer_roles")(sequelize, Sequelize.DataTypes);
db.VolunteerApplication = require("./volunteer_applications")(sequelize, Sequelize.DataTypes);
db.VolunteerAssignment = require("./volunteer_assignments")(sequelize, Sequelize.DataTypes);

// Users --- Events (One-to-Many via Coordinator_id)
db.User.hasMany(db.Event, { foreignKey: "coordinator_id" });
db.Event.belongsTo(db.User, { foreignKey: "coordinator_id" });

// Users --- Roles (Many-to-Many via USER_ROLES)
db.User.belongsToMany(db.Role, { through: db.UserRole, foreignKey: "user_id" });
db.Role.belongsToMany(db.User, { through: db.UserRole, foreignKey: "role_id" });

// Roles--- Permissions (Many-to-Many via Role_Permissions table)
db.Role.belongsToMany(db.Permission, { through: "ROLE_PERMISSIONS", foreignKey: "role_id" });
db.Permission.belongsToMany(db.Role, { through: "ROLE_PERMISSIONS", foreignKey: "permission_id" });

// Events --- EventRegistrations (One-to-Many via Event_id)
db.Event.hasMany(db.EventRegistration, { foreignKey: "event_id" });
db.EventRegistration.belongsTo(db.Event, { foreignKey: "event_id" });

//  EventRegistrations --- Users (One-to-Many via User_ID)
db.User.hasMany(db.EventRegistration, { foreignKey: "user_id" });
db.EventRegistration.belongsTo(db.User, { foreignKey: "user_id" });

// Events --- EventTypes (Many-to-Many via Event_EventTypes)
db.Event.belongsToMany(db.EventType, { through: "EVENT_EVENTTYPES", foreignKey: "event_id" });
db.EventType.belongsToMany(db.Event, { through: "EVENT_EVENTTYPES", foreignKey: "type_id" });

// Events --- Venues (Many-to-Many via Event_Venues)
db.Event.belongsToMany(db.Venue, { through: "EVENT_VENUES", foreignKey: "event_id" });
db.Venue.belongsToMany(db.Event, { through: "EVENT_VENUES", foreignKey: "venue_id" });

// VolunteerApplication --- User (One-to-Many via User_ID)
db.User.hasMany(db.VolunteerApplication, { foreignKey: "user_id" });
db.VolunteerApplication.belongsTo(db.User, { foreignKey: "user_id" });

// VolunteerRole --- VolunteerApplication (One-to-Many via Volunteer_Role_ID)
db.VolunteerRole.hasMany(db.VolunteerApplication, { foreignKey: "volunteer_role_id" });
db.VolunteerApplication.belongsTo(db.VolunteerRole, { foreignKey: "volunteer_role_id" });

// Events --- VolunteerApplication (One-to-Many via Event_ID)
db.Event.hasMany(db.VolunteerApplication, { foreignKey: "event_id" });
db.VolunteerApplication.belongsTo(db.Event, { foreignKey: "event_id" });

// User --- VolunteerAssignment (Many-to-Many via Volunteer_ID)
db.User.hasMany(db.VolunteerAssignment, { foreignKey: "volunteer_id" });
db.VolunteerAssignment.belongsTo(db.User, { foreignKey: "volunteer_id" });

// Event --- VolunteerAssignment (Many-to-Many via Event_ID)
db.Event.hasMany(db.VolunteerAssignment, { foreignKey: "event_id" });
db.VolunteerAssignment.belongsTo(db.Event, { foreignKey: "event_id" });

// VolunteerRole --- VolunteerAssignment (Many-to-Many via Volunteer_Role_ID)
db.VolunteerRole.hasMany(db.VolunteerAssignment, { foreignKey: "volunteer_role_id" });
db.VolunteerAssignment.belongsTo(db.VolunteerRole, { foreignKey: "volunteer_role_id" });

module.exports = db;
