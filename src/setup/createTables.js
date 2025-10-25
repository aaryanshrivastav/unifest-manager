import User from '../models/user.js';
import Venue from '../models/venueNRoles.js';
import Event from '../models/event.js';
import Registration from '../models/registration.js';
import VolunteerApplication from '../models/volunteerApplication.js';
import VolunteerAssignment from '../models/volunteerAssignment.js';
import LogHistory from '../models/loghistory.js';

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
