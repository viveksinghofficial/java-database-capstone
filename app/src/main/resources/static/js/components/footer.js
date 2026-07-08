/*
|--------------------------------------------------------------------------
| Function: renderFooter()
|--------------------------------------------------------------------------
| Purpose:
| Dynamically generates and inserts the footer section into the page.
| The footer includes:
|   - Hospital logo
|   - Copyright information
|   - Company links
|   - Support links
|   - Legal links
|--------------------------------------------------------------------------
*/
function renderFooter() {

    // Select the footer placeholder element from the DOM
    const footer = document.getElementById("footer");

    // If the footer element does not exist, stop execution
    if (!footer) return;

    /*
    -----------------------------------------------------------------------
    Insert Footer HTML Content
    -----------------------------------------------------------------------
    Set the inner HTML of the footer element.
    This dynamically creates the complete footer structure.
    -----------------------------------------------------------------------
    */
    footer.innerHTML = `
        <!-- Footer Wrapper -->
        <footer class="footer">

            <!-- Footer Container -->
            <div class="footer-container">

                <!-- Hospital Logo and Copyright Section -->
                <div class="footer-logo">
                    <img
                        src="../assets/images/logo/logo.png"
                        alt="Hospital CMS Logo"
                    >
                    <p>&copy; Copyright 2025. All Rights Reserved by Hospital CMS.</p>
                </div>

                <!-- Footer Links Section -->
                <div class="footer-links">

                    <!-- Company Links -->
                    <div class="footer-column">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Press</a>
                    </div>

                    <!-- Support Links -->
                    <div class="footer-column">
                        <h4>Support</h4>
                        <a href="#">Account</a>
                        <a href="#">Help Center</a>
                        <a href="#">Contact Us</a>
                    </div>

                    <!-- Legal Links -->
                    <div class="footer-column">
                        <h4>Legals</h4>
                        <a href="#">Terms &amp; Conditions</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Licensing</a>
                    </div>

                </div>
                <!-- End of Footer Links -->

            </div>
            <!-- End of Footer Container -->

        </footer>
    `;
}

/*
|--------------------------------------------------------------------------
| Render Footer
|--------------------------------------------------------------------------
| Call the renderFooter() function to dynamically populate
| the footer section when the page loads.
|--------------------------------------------------------------------------
*/
renderFooter();