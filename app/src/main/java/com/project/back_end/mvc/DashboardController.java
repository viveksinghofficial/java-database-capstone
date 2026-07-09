package com.project.back_end.mvc;

import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DashboardController {

    // Shared service used to validate JWT tokens
    @Autowired
    private Service service;

    /**
     * Handles requests to the admin dashboard.
     * Only users with a valid admin token can access this page.
     *
     * @param token JWT token
     * @return Admin dashboard view or redirect to home page
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {

        ResponseEntity<String> response = service.validateToken(token, "admin");

        if (response.getStatusCode() == HttpStatus.OK) {
            return "admin/adminDashboard";
        }

        return "redirect:/";
    }

    /**
     * Handles requests to the doctor dashboard.
     * Only users with a valid doctor token can access this page.
     *
     * @param token JWT token
     * @return Doctor dashboard view or redirect to home page
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {

        ResponseEntity<String> response = service.validateToken(token, "doctor");

        if (response.getStatusCode() == HttpStatus.OK) {
            return "doctor/doctorDashboard";
        }

        return "redirect:/";
    }
}