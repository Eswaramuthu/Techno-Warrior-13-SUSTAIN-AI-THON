// script.js

// Function to toggle the visibility of the psychiatrist's details
function showDetails(psychiatristId) {
    const detailsDiv = document.getElementById(psychiatristId);
    if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
        detailsDiv.style.display = 'block';
    } else {
        detailsDiv.style.display = 'none';
    }
}
