const User = require('../models/user');
const Venue = require('../models/venueNRoles');
const Event = require('../models/event');
const Registration = require('../models/registration');
const VolunteerApplication = require('../models/volunteerApplication');
const VolunteerAssignment = require('../models/volunteerAssignment');
const LogHistory = require('../models/loghistory');

async function createAllTables() {
  await Venue.createTable();            
  await User.createTable();
  await LogHistory.createTable();
  await Event.createTable();
  await Registration.createTable();
  await VolunteerApplication.createTable();
  await VolunteerAssignment.createTable();
  console.log('All tables created successfully!');
}

createAllTables();
