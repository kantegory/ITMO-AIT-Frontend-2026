document.addEventListener('DOMContentLoaded', function() {
    const userType = document.getElementById('userType');
    const organizerType = document.getElementById('organizerType');
    const organizerFields = document.getElementById('organizerFields');
    
    function toggleOrganizerFields() {
        organizerFields.style.display = organizerType.checked ? 'block' : 'none';
    }
    
    userType.addEventListener('change', toggleOrganizerFields);
    organizerType.addEventListener('change', toggleOrganizerFields);
});