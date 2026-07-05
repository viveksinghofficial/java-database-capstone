# Section 1: Architecture summary
This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates are used for the Admin and Doctor dashboards, while REST APIs serve all other modules. The application interacts with two databases—MySQL (for patient, doctor, appointment, and admin data) and MongoDB (for prescriptions). All controllers route requests through a common service layer, which in turn delegates to the appropriate repositories. MySQL uses JPA entities while MongoDB uses document models.

# Section 2: Numbered flow of data and control
1. User accesses AdminDashboard or Appointment pages.
2. The action is routed to the appropriate Thymeleaf or REST controller.
3. The controller calls the service layer for appropriate data validation and business logic.
4. The service layer communicates with the Repository Layer to perform data access operations. 
5. Each repository interfaces directly with the underlying database engine.
6. The model classes provide a consistent, object-oriented representation of the data across the application layers.
7. The bound models are used in the response layer for either MVC flows or REST flows.
