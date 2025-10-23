const User = require('../models/user');
const Venue = require('../models/venueNRoles');
const Event = require('../models/event');
const Registration = require('../models/registration');
const VolunteerApplication = require('../models/volunteerApplication');
const VolunteerAssignment = require('../models/volunteerAssignment');

async function createAllTables() {
  await Venue.createTable();             // roles and venues first (dependencies)
  await User.createTable();
  await Event.createTable();
  await Registration.createTable();
  await VolunteerApplication.createTable();
  await VolunteerAssignment.createTable();

  console.log('All tables created successfully!');
}

createAllTables();
