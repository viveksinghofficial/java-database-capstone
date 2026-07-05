## MySQL Database Design

### Table : patients

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| patient_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| gender | ENUM('Male','Female','Other') | NOT NULL |
| date_of_birth | DATE | NOT NULL |
| phone | VARCHAR(15) | NOT NULL, UNIQUE |
| email | VARCHAR(100) | UNIQUE |
| address | VARCHAR(255) | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |


### Table : doctors

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| doctor_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| specialization | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | NOT NULL, UNIQUE |
| email | VARCHAR(100) | UNIQUE |
| available | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |


### Table : appointments

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| appointment_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| patient_id | INT | NOT NULL, FOREIGN KEY REFERENCES patients(patient_id) |
| doctor_id | INT | NOT NULL, FOREIGN KEY REFERENCES doctors(doctor_id) |
| appointment_date | DATE | NOT NULL |
| appointment_time | TIME | NOT NULL |
| status | ENUM('Scheduled','Completed','Cancelled') | DEFAULT 'Scheduled' |
| notes | TEXT | |


### Table : admin

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| admin_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |


### Table : clinic_locations

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| location_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| clinic_name | VARCHAR(100) | NOT NULL |
| address | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(15) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |


### Table : payments

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| payment_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| appointment_id | INT | NOT NULL, FOREIGN KEY REFERENCES appointments(appointment_id) |
| amount | DECIMAL(10,2) | NOT NULL |
| payment_method | ENUM('Cash','Card','UPI','Online') | NOT NULL |
| payment_status | ENUM('Pending','Paid','Refunded') | DEFAULT 'Pending' |
| payment_date | DATETIME | DEFAULT CURRENT_TIMESTAMP |

-----

## Foreign Key Relationships

- appointments.patient_id → patients.patient_id
- appointments.doctor_id → doctors.doctor_id
- payments.appointment_id → appointments.appointment_id

  -----

  ## Constraints

- All primary keys use **AUTO_INCREMENT**.
- Required fields use **NOT NULL**.
- Phone numbers and emails should be **UNIQUE** where appropriate.
- Email and phone format validation should be handled in the application code using Java/Spring Boot.
- Passwords should be stored as **hashed passwords**, never plain text.

  -----

  ## Design Considerations

### What happens if a patient is deleted?

Appointments should **not** be automatically deleted because they are part of the clinic's medical history. Prevent deletion if appointments exist (`ON DELETE RESTRICT`) or use soft deletes.

### Should a doctor be allowed to have overlapping appointments?

**No.** The application should check that a doctor does not already have another appointment at the same date and time before creating a new appointment. A unique constraint on `(doctor_id, appointment_date, appointment_time)` can also help enforce this.
