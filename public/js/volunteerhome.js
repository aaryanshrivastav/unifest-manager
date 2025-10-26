document.addEventListener('DOMContentLoaded', function() {
    loadVolunteerProfile();
});

function loadVolunteerProfile() {
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    
    const volunteer = volunteers.length > 0 ? volunteers[volunteers.length - 1] : null;
    
    if (volunteer) {
        document.getElementById('profileName').textContent = volunteer.name;
        document.getElementById('profileYear').textContent = getYearText(volunteer.year);
        document.getElementById('profileExperience').textContent = volunteer.experience;
    } else {
        document.getElementById('profileName').textContent = 'No profile found';
        document.getElementById('profileYear').textContent = 'N/A';
        document.getElementById('profileExperience').textContent = 'Please complete your volunteer registration first.';
    }
}

function getYearText(year) {
    const yearMap = {
        '1': 'First Year',
        '2': 'Second Year',
        '3': 'Third Year',
        '4': 'Fourth Year'
    };
    return yearMap[year] || 'Not specified';
}