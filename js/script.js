// Event listener for using current location
document.getElementById('geoLocationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            fetchData(position.coords.latitude, position.coords.longitude);
        }, function() {
            showError('Permission denied.');
        });
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

// Event listener for listed locations
document.getElementById('predefinedLocations').addEventListener('change', function() {
    const [latitude, longitude] = this.value.split(',');
    if (latitude && longitude) {
        fetchData(latitude, longitude);
    }
});

// Event listener for custom locations 
document.getElementById('searchButton').addEventListener('click', function() {
    const customLocation = document.getElementById('customLocation').value;
    const [latitude, longitude] = customLocation.split(',');
    if (latitude && longitude) {
        fetchData(latitude.trim(), longitude.trim());
    } else {
        showError('Please enter a valid latitude and longitude with this format: lat,lng');
    }
});


// Fetch data from the API for today & tomorrow
function fetchData(latitude, longitude) {
    const urlToday = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
    const urlTomorrow = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow`;

    Promise.all([
        fetch(urlToday).then(response => response.json()),
        fetch(urlTomorrow).then(response => response.json())
    ])
    .then(([dataToday, dataTomorrow]) => {
        if (dataToday.status !== 'OK' || dataTomorrow.status !== 'OK') {
            showError('Error fetching data from the API.');
            return;
        }

        updateDisplay('today', dataToday.results);
        updateDisplay('tomorrow', dataTomorrow.results);
    })
    .catch(error => {
        // Handle network or other fetch errors
        showError('An error occurred while fetching data: ' + error.message);
    });
}

// Display error messages
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'block';
    errorElement.textContent = message;

    // Clear previous data fields
    clearDataFields();
}



