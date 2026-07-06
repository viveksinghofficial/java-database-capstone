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

### Constraints

- All primary keys use **AUTO_INCREMENT**.
- Required fields use **NOT NULL**.
- Phone numbers and emails should be **UNIQUE** where appropriate.
- Email and phone format validation should be handled in the application code using Java/Spring Boot.
- Passwords should be stored as **hashed passwords**, never plain text.

  -----

### Design Considerations

### 1. What happens if a patient is deleted?

Appointments should **not** be automatically deleted because they are part of the clinic's medical history. Prevent deletion if appointments exist (`ON DELETE RESTRICT`) or use soft deletes.

### 2. Should a doctor be allowed to have overlapping appointments?

**No.** The application should check that a doctor does not already have another appointment at the same date and time before creating a new appointment. A unique constraint on `(doctor_id, appointment_date, appointment_time)` can also help enforce this.

### 3. Should each doctor have their own available time slots?

**Yes.** Each doctor should maintain their own schedule because different doctors have different working hours, days off, and leave periods.

### 4. Should a patient's past appointment history be retained forever?

**Yes.**
Past appointments are valuable for:

- Medical history
- Future diagnosis
- Prescriptions
- Billing records
- Legal and audit purposes

### 5. Is a prescription tied to a specific appointment or can it exist independently?

**It should be tied to a specific appointment.**
A prescription is usually issued during a doctor's consultation, so it should reference the appointment in which it was created.



## MongoDB Collection Design

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc1234567890abcdef12')",
  "appointmentId": 101,
  "patientId": 25,
  "doctorId": 8,
  "prescribedAt": "2026-07-06T10:30:00Z",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice a day",
      "duration": "5 days"
    },
    {
      "name": "Vitamin C",
      "dosage": "1000mg",
      "frequency": "Once a day",
      "duration": "7 days"
    }
  ],
  "doctorNotes": "Drink plenty of water and take medicines after meals.",
  "followUp": {
    "required": true,
    "date": "2026-07-13"
  },
  "tags": [
    "fever",
    "viral",
    "follow-up"
  ],
  "metadata": {
    "createdBy": "Dr. Sarah Johnson",
    "lastUpdated": "2026-07-06T10:35:00Z",
    "version": 1
  }
}
```

### Design Considerations

- **Store only IDs for patients, doctors, and appointments** (`patientId`, `doctorId`, `appointmentId`) instead of embedding the full objects. This avoids data duplication and ensures updates in MySQL remain consistent.
- **Use embedded documents** for medications, follow-up details, and metadata since they belong exclusively to a single prescription.
- **Use arrays** for medications and tags because a prescription can contain multiple medicines and multiple labels.
- **Schema evolution is flexible.** New fields such as `labResults`, `attachments`, `allergies`, or `digitalSignature` can be added to future documents without affecting existing ones.


### Example Chat Message Document

```json
{
  "_id": "ObjectId('64abc9876543210fedcba98')",
  "appointmentId": 101,
  "senderId": 25,
  "senderRole": "Patient",
  "receiverId": 8,
  "message": "Can I take the medicine after dinner instead of lunch?",
  "attachments": [],
  "sentAt": "2026-07-06T18:15:00Z",
  "isRead": false
}
```
