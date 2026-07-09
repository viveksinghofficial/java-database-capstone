/*
 * ============================================================================
 * Admin Dashboard - Doctor Management
 * ============================================================================
 * This script manages doctor-related operations for the admin dashboard.
 * It allows the admin to:
 *   - View all doctors.
 *   - Search and filter doctors.
 *   - Add a new doctor.
 * ============================================================================
 */

import { openModal, closeModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

/* Get the container where doctor cards will be displayed */
const content = document.getElementById("content");

/* Open the Add Doctor modal when the button is clicked */
document.getElementById("addDoctorBtn").addEventListener("click", () => {
    openModal("addDoctor");
});

/* Load all doctor cards after the page has finished loading */
document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();
});

/*
 * Function: loadDoctorCards
 * Purpose:
 * Fetch all doctors from the backend and display them.
 */
async function loadDoctorCards() {
    try {
        /* Fetch all doctors */
        const doctors = await getDoctors();

        /* Clear any existing cards */
        content.innerHTML = "";

        /* Create and display a card for each doctor */
        doctors.forEach((doctor) => {
            const card = createDoctorCard(doctor);
            content.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

/* Listen for search and filter changes */
document.getElementById("doctorSearch")
    .addEventListener("input", filterDoctorsOnChange);

document.getElementById("timeFilter")
    .addEventListener("change", filterDoctorsOnChange);

document.getElementById("specialtyFilter")
    .addEventListener("change", filterDoctorsOnChange);

/*
 * Function: filterDoctorsOnChange
 * Purpose:
 * Filter doctors by name, available time, and specialty.
 */
async function filterDoctorsOnChange() {

    /* Read filter values */
    const name = document.getElementById("doctorSearch").value.trim() || null;
    const time = document.getElementById("timeFilter").value || null;
    const specialty = document.getElementById("specialtyFilter").value || null;

    try {
        /* Fetch filtered doctors */
        const doctors = await filterDoctors(name, time, specialty);

        if (doctors.length > 0) {
            renderDoctorCards(doctors);
        } else {
            content.innerHTML =
                "<h3>No doctors found with the given filters.</h3>";
        }

    } catch (error) {
        alert("Unable to filter doctors.");
        console.error(error);
    }
}

/*
 * Function: renderDoctorCards
 * Purpose:
 * Display a list of doctor cards.
 *
 * Parameter:
 * doctors - Array of doctor objects.
 */
function renderDoctorCards(doctors) {

    /* Remove old cards */
    content.innerHTML = "";

    /* Display every doctor */
    doctors.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        content.appendChild(card);
    });
}

/*
 * Function: adminAddDoctor
 * Purpose:
 * Read doctor details from the modal form and save them.
 */
async function adminAddDoctor() {

    /* Collect form values */
    const name = document.getElementById("doctorName").value;
    const email = document.getElementById("doctorEmail").value;
    const phone = document.getElementById("doctorPhone").value;
    const password = document.getElementById("doctorPassword").value;
    const specialty = document.getElementById("doctorSpecialty").value;
    const availableTimes = document.getElementById("doctorAvailableTimes").value;

    /* Retrieve authentication token */
    const token = localStorage.getItem("token");

    /* Stop if the admin is not logged in */
    if (!token) {
        alert("Please login first.");
        return;
    }

    /* Create doctor object */
    const doctor = {
        name,
        email,
        phone,
        password,
        specialty,
        availableTimes
    };

    try {
        /* Save doctor to the backend */
        await saveDoctor(doctor, token);

        alert("Doctor added successfully.");

        /* Close the modal */
        closeModal();

        /* Refresh the page */
        location.reload();

    } catch (error) {
        alert("Failed to add doctor.");
        console.error(error);
    }
}