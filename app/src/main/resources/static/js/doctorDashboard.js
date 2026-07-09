// Import function to fetch all appointments from the backend
import { getAllAppointments } from "./services/appointmentRecordService.js";

// Import function to create a table row for each patient appointment
import { createPatientRow } from "./components/patientRows.js";

// Get the table body where appointment rows will be inserted
const tableBody = document.getElementById("patientTableBody");

// Initialize the selected date with today's date (YYYY-MM-DD format)
let selectedDate = new Date().toISOString().split("T")[0];

// Get the authentication token stored after login
const token = localStorage.getItem("token");

// Patient name filter (null means no filtering)
let patientName = null;

// Search patient by name
const searchBar = document.getElementById("searchPatient");

searchBar.addEventListener("input", () => {
  const value = searchBar.value.trim();

  if (value !== "") {
    patientName = value;
  } else {
    patientName = null;
  }

  loadAppointments();
});

// Show today's appointments
const todayBtn = document.getElementById("todayBtn");

todayBtn.addEventListener("click", () => {
  selectedDate = new Date().toISOString().split("T")[0];

  const datePicker = document.getElementById("appointmentDate");
  datePicker.value = selectedDate;

  loadAppointments();
});

// Filter appointments by selected date
const datePicker = document.getElementById("appointmentDate");

datePicker.value = selectedDate;

datePicker.addEventListener("change", () => {
  selectedDate = datePicker.value;
  loadAppointments();
});

// Load appointments from the backend and display them
async function loadAppointments() {
  try {
    // Fetch appointments based on selected date and patient name
    const appointments = await getAllAppointments(
      selectedDate,
      patientName,
      token
    );

    // Clear previous table rows
    tableBody.innerHTML = "";

    // Display message if no appointments are found
    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">
            No Appointments found for today.
          </td>
        </tr>
      `;
      return;
    }

    // Create and append a row for each appointment
    appointments.forEach((appointment) => {
      const patient = {
        id: appointment.patient.id,
        name: appointment.patient.name,
        phone: appointment.patient.phone,
        email: appointment.patient.email,
      };

      const row = createPatientRow(patient, appointment);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          Error loading appointments. Try again later.
        </td>
      </tr>
    `;
  }
}

// Initialize the page after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  renderContent();
  loadAppointments();
});
