/*
 * doctorCard.js
 *
 * This file is responsible for creating and rendering a single doctor card.
 * The card displays doctor information and provides different actions
 * depending on the current user's role.
 */

// Import the booking overlay function for logged-in patients
import { showBookingOverlay } from "./loggedPatient.js";

// Import API function to delete a doctor (Admin only)
import { deleteDoctor } from "../services/doctorServices.js";

// Import function to fetch logged-in patient details
import { getPatientByToken } from "../services/patientServices.js";

/**
 * Creates and returns a doctor card element.
 *
 * @param {Object} doctor - Doctor information.
 * @returns {HTMLElement} Doctor card element.
 */
export function createDoctorCard(doctor) {

    // Create the main container for the doctor card
    const card = document.createElement("div");
    card.className = "doctor-card";

    // Retrieve the current user's role from localStorage
    const role = localStorage.getItem("role");

    // Create a container to hold doctor information
    const doctorInfo = document.createElement("div");
    doctorInfo.className = "doctor-info";

    // Create and display the doctor's name
    const doctorName = document.createElement("h3");
    doctorName.textContent = doctor.name;

    // Create and display the doctor's specialization
    const specialization = document.createElement("p");
    specialization.textContent = `Specialization: ${doctor.specialization}`;

    // Create and display the doctor's email
    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    // Create a heading for available appointment timings
    const timingHeading = document.createElement("p");
    timingHeading.innerHTML = "<strong>Available Slots:</strong>";

    // Create a list for available appointment timings
    const timingList = document.createElement("ul");

    // Loop through available timings and display each slot
    doctor.availableTimes.forEach((time) => {
        const listItem = document.createElement("li");
        listItem.textContent = time;
        timingList.appendChild(listItem);
    });

    // Append all doctor information elements to the information container
    doctorInfo.appendChild(doctorName);
    doctorInfo.appendChild(specialization);
    doctorInfo.appendChild(email);
    doctorInfo.appendChild(timingHeading);
    doctorInfo.appendChild(timingList);

    // Create a container for action buttons
    const actions = document.createElement("div");
    actions.className = "card-actions";

    /* ==========================================================
       ADMIN ROLE ACTIONS
       ========================================================== */

    if (role === "ADMIN") {

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Doctor";
        deleteButton.className = "delete-btn";

        // Add click event to delete doctor
        deleteButton.addEventListener("click", async () => {

            // Get admin token from localStorage
            const token = localStorage.getItem("token");

            try {

                // Call API to delete doctor
                const response = await deleteDoctor(doctor.id, token);

                // Show success message
                alert(response.message || "Doctor deleted successfully.");

                // Remove doctor card from UI
                card.remove();

            } catch (error) {

                // Show error message if deletion fails
                alert(error.message || "Unable to delete doctor.");

            }
        });

        // Add Delete button to action container
        actions.appendChild(deleteButton);
    }

    /* ==========================================================
       PATIENT (NOT LOGGED-IN) ROLE ACTIONS
       ========================================================== */

    else if (role !== "PATIENT") {

        // Create Book Now button
        const bookButton = document.createElement("button");
        bookButton.textContent = "Book Now";
        bookButton.className = "book-btn";

        // Ask user to login before booking
        bookButton.addEventListener("click", () => {
            alert("Please login as a patient to book an appointment.");
        });

        // Add button to action container
        actions.appendChild(bookButton);
    }

    /* ==========================================================
       LOGGED-IN PATIENT ROLE ACTIONS
       ========================================================== */

    else {

        // Create Book Now button
        const bookButton = document.createElement("button");
        bookButton.textContent = "Book Now";
        bookButton.className = "book-btn";

        // Handle appointment booking
        bookButton.addEventListener("click", async () => {

            // Get patient token
            const token = localStorage.getItem("token");

            // Redirect if token is not available
            if (!token) {
                window.location.href = "index.html";
                return;
            }

            try {

                // Fetch logged-in patient details
                const patient = await getPatientByToken(token);

                // Open booking overlay with doctor and patient information
                showBookingOverlay(doctor, patient);

            } catch (error) {

                // Display error if patient data cannot be loaded
                alert(error.message || "Unable to load patient details.");

            }
        });

        // Add Book button to action container
        actions.appendChild(bookButton);
    }

    // Append doctor information and action buttons to the card
    card.appendChild(doctorInfo);
    card.appendChild(actions);

    // Return the completed doctor card
    return card;
}