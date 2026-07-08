/*
|--------------------------------------------------------------------------
| header.js
|--------------------------------------------------------------------------
| This file dynamically renders the application's header according to
| the user's role and authentication status.
|
| Supported Roles:
| • Admin
| • Doctor
| • Patient (Guest)
| • Logged-in Patient
|
| Functions:
| • renderHeader()
| • attachHeaderButtonListeners()
| • logout()
| • logoutPatient()
|--------------------------------------------------------------------------
*/


/**
 * -------------------------------------------------------------------------
 * Step 1: Define the renderHeader() Function
 * -------------------------------------------------------------------------
 * This function generates the complete header dynamically based on:
 * • Current page
 * • User role
 * • Login status
 * -------------------------------------------------------------------------
 */
function renderHeader() {

    /**
     * ---------------------------------------------------------------------
     * Step 2: Select the Header Container
     * ---------------------------------------------------------------------
     * Get the HTML element where the generated header will be inserted.
     * ---------------------------------------------------------------------
     */
    const headerDiv = document.getElementById("header");


    /**
     * ---------------------------------------------------------------------
     * Step 3: Check if Current Page is the Home Page
     * ---------------------------------------------------------------------
     * If the user is on the application's landing page:
     * • Remove any previously stored user role.
     * • Display only the logo and application title.
     * • Exit the function.
     * ---------------------------------------------------------------------
     */
    if (window.location.pathname.endsWith("/")) {

        // Remove previously selected role
        localStorage.removeItem("userRole");

        // Display basic header
        headerDiv.innerHTML = `
            <header class="header">

                <div class="logo-section">
                    <img src="../assets/images/logo/logo.png"
                         alt="Hospital CRM Logo"
                         class="logo-img">

                    <span class="logo-title">
                        Hospital CMS
                    </span>
                </div>

            </header>
        `;

        return;
    }


    /**
     * ---------------------------------------------------------------------
     * Step 4: Retrieve User Session Information
     * ---------------------------------------------------------------------
     * Read the user's role and authentication token from Local Storage.
     * ---------------------------------------------------------------------
     */
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");


    /**
     * ---------------------------------------------------------------------
     * Step 5: Initialize Header HTML
     * ---------------------------------------------------------------------
     * Begin building the header structure.
     * Navigation buttons will be appended according to the user's role.
     * ---------------------------------------------------------------------
     */
    let headerContent = `
        <header class="header">

            <div class="logo-section">

                <img src="../assets/images/logo/logo.png"
                     alt="Hospital CRM Logo"
                     class="logo-img">

                <span class="logo-title">
                    Hospital CMS
                </span>

            </div>

            <nav>
    `;


    /**
     * ---------------------------------------------------------------------
     * Step 6: Validate User Session
     * ---------------------------------------------------------------------
     * Admins, Doctors and Logged-in Patients must have a valid token.
     * If no token exists:
     * • Remove stored role
     * • Notify the user
     * • Redirect to the home page
     * ---------------------------------------------------------------------
     */
    if (
        (role === "admin" ||
         role === "doctor" ||
         role === "loggedPatient") &&
        !token
    ) {

        localStorage.removeItem("userRole");

        alert("Session expired or invalid login. Please log in again.");

        window.location.href = "/";

        return;
    }


    /**
     * ---------------------------------------------------------------------
     * Step 7: Generate Role-Specific Navigation
     * ---------------------------------------------------------------------
     * Display different navigation options depending on the user's role.
     * ---------------------------------------------------------------------
     */

    // ===================== Admin =====================
    if (role === "admin") {

        headerContent += `
            <button
                id="addDocBtn"
                class="adminBtn"
                onclick="openModal('addDoctor')">

                Add Doctor

            </button>

            <a href="#" onclick="logout()">
                Logout
            </a>
        `;
    }

    // ===================== Doctor =====================
    else if (role === "doctor") {

        headerContent += `
            <button
                class="adminBtn"
                onclick="selectRole('doctor')">

                Home

            </button>

            <a href="#" onclick="logout()">
                Logout
            </a>
        `;
    }

    // ===================== Guest Patient =====================
    else if (role === "patient") {

        headerContent += `
            <button
                id="patientLogin"
                class="adminBtn">

                Login

            </button>

            <button
                id="patientSignup"
                class="adminBtn">

                Sign Up

            </button>
        `;
    }

    // ===================== Logged-in Patient =====================
    else if (role === "loggedPatient") {

        headerContent += `
            <button
                id="home"
                class="adminBtn"
                onclick="window.location.href='/pages/loggedPatientDashboard.html'">

                Home

            </button>

            <button
                id="patientAppointments"
                class="adminBtn"
                onclick="window.location.href='/pages/patientAppointments.html'">

                Appointments

            </button>

            <a href="#" onclick="logoutPatient()">
                Logout
            </a>
        `;
    }


    /**
     * ---------------------------------------------------------------------
     * Step 8: Close the Header Structure
     * ---------------------------------------------------------------------
     */
    headerContent += `
            </nav>
        </header>
    `;


    /**
     * ---------------------------------------------------------------------
     * Step 9: Render the Header
     * ---------------------------------------------------------------------
     * Insert the completed HTML into the header container.
     * ---------------------------------------------------------------------
     */
    headerDiv.innerHTML = headerContent;


    /**
     * ---------------------------------------------------------------------
     * Step 10: Attach Event Listeners
     * ---------------------------------------------------------------------
     * Since the header is dynamically created using innerHTML,
     * attach JavaScript event listeners after rendering.
     * ---------------------------------------------------------------------
     */
    attachHeaderButtonListeners();
}



/**
 * -------------------------------------------------------------------------
 * Step 11: Attach Header Button Listeners
 * -------------------------------------------------------------------------
 * Add event listeners to dynamically created buttons.
 *
 * Example:
 * • Patient Login
 * • Patient Signup
 * • Admin Login
 * • Doctor Login
 * -------------------------------------------------------------------------
 */
function attachHeaderButtonListeners() {

    const patientLogin = document.getElementById("patientLogin");
    const patientSignup = document.getElementById("patientSignup");

    if (patientLogin) {
        patientLogin.addEventListener("click", () => {
            openModal("patientLogin");
        });
    }

    if (patientSignup) {
        patientSignup.addEventListener("click", () => {
            openModal("patientSignup");
        });
    }
}



/**
 * -------------------------------------------------------------------------
 * Step 12: Logout (Admin / Doctor)
 * -------------------------------------------------------------------------
 * Remove authentication data and redirect to the home page.
 * -------------------------------------------------------------------------
 */
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    window.location.href = "/";
}



/**
 * -------------------------------------------------------------------------
 * Step 13: Logout Logged-in Patient
 * -------------------------------------------------------------------------
 * Remove patient session data and redirect to the patient dashboard.
 * -------------------------------------------------------------------------
 */
function logoutPatient() {

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    window.location.href = "/pages/patientDashboard.html";
}



/**
 * -------------------------------------------------------------------------
 * Step 14: Initialize the Header
 * -------------------------------------------------------------------------
 * Render the appropriate header as soon as the page loads.
 * -------------------------------------------------------------------------
 */
renderHeader();
