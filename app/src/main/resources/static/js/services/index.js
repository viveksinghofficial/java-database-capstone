/*
  Import the openModal function to handle showing login popups/modals.
*/
import { openModal } from "../components/modals.js";

/*
  Import the base API URL from the configuration file.
*/
import { BASE_URL } from "../config/config.js";

/*
  Define API endpoints for admin and doctor login.
*/
const ADMIN_API = `${BASE_URL}/admin/login`;
const DOCTOR_API = `${BASE_URL}/doctor/login`;

/*
  Wait until the page has fully loaded before attaching event listeners.
*/
window.onload = () => {
  /*
    Get the admin and doctor login buttons.
  */
  const adminLoginBtn = document.getElementById("adminLogin");
  const doctorLoginBtn = document.getElementById("doctorLogin");

  /*
    Open the admin login modal when the admin login button is clicked.
  */
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      openModal("adminLogin");
    });
  }

  /*
    Open the doctor login modal when the doctor login button is clicked.
  */
  if (doctorLoginBtn) {
    doctorLoginBtn.addEventListener("click", () => {
      openModal("doctorLogin");
    });
  }
};

/*
  Handle admin login.
*/
window.adminLoginHandler = async function () {
  try {
    /*
      Step 1: Get username and password entered by the admin.
    */
    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;

    /*
      Step 2: Create the request object.
    */
    const admin = {
      username,
      password,
    };

    /*
      Step 3: Send login request.
    */
    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    });

    /*
      Step 4: Process successful login.
    */
    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("token", data.token);

      selectRole("admin");
    } else {
      /*
        Step 5: Invalid credentials.
      */
      alert("Invalid admin username or password.");
    }
  } catch (error) {
    /*
      Step 6: Handle network/server errors.
    */
    alert("Something went wrong. Please try again later.");
  }
};

/*
  Handle doctor login.
*/
window.doctorLoginHandler = async function () {
  try {
    /*
      Step 1: Get doctor email and password.
    */
    const email = document.getElementById("doctorEmail").value.trim();
    const password = document.getElementById("doctorPassword").value;

    /*
      Step 2: Create the request object.
    */
    const doctor = {
      email,
      password,
    };

    /*
      Step 3: Send login request.
    */
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    /*
      Step 4: Process successful login.
    */
    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("token", data.token);

      selectRole("doctor");
    } else {
      /*
        Step 5: Invalid credentials.
      */
      alert("Invalid doctor email or password.");
    }
  } catch (error) {
    /*
      Step 6: Handle unexpected errors.
    */
    console.error(error);
    alert("Something went wrong. Please try again later.");
  }
};