// Get references to the hamburger and nav menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

// Toggle the visibility of the nav menu when the hamburger is clicked
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

