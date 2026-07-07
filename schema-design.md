## MySQL Database Design

### Table: patients

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(10) | NOT NULL, UNIQUE |
| address | VARCHAR(255) | NOT NULL |

#### Primary Key
- `id`

#### Foreign Keys
- None

#### Constraints
- `id` is the primary key and is automatically generated (`AUTO_INCREMENT`).
- `name` cannot be `NULL` and should contain **3–100 characters**.
- `email` cannot be `NULL` and should be **UNIQUE**. Its format is validated in the application using the `@Email` annotation.
- `password` cannot be `NULL` and should contain at least **6 characters**. Passwords should be stored as **hashed values** (e.g., BCrypt) instead of plain text.
- `phone` cannot be `NULL`, must contain exactly **10 digits**, and should be **UNIQUE**. Its format is validated in the application using the `@Pattern` annotation.
- `address` cannot be `NULL` and should not exceed **255 characters**.



### Table: doctors

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| specialty | VARCHAR(50) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(10) | NOT NULL, UNIQUE |

#### Primary Key
- `id`

#### Foreign Keys
- None

#### Constraints
- `id` is the primary key and is automatically generated (`AUTO_INCREMENT`).
- `name` cannot be `NULL` and should contain **3–100 characters**.
- `specialty` cannot be `NULL` and should contain **3–50 characters**.
- `email` cannot be `NULL` and should be **UNIQUE**. Its format is validated in the application using the `@Email` annotation.
- `password` cannot be `NULL` and should contain at least **6 characters**. Passwords should be stored as **hashed values** (e.g., BCrypt).
- `phone` cannot be `NULL`, must contain exactly **10 digits**, and should be **UNIQUE**. Its format is validated in the application using the `@Pattern` annotation.

---

### Table: doctor_available_times

The `availableTimes` field is annotated with `@ElementCollection`, so JPA stores it in a separate table.

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| doctor_id | BIGINT | NOT NULL, FOREIGN KEY REFERENCES doctors(id) |
| available_time | VARCHAR(20) | NOT NULL |

#### Primary Key
- Composite Key: (`doctor_id`, `available_time`)

#### Foreign Key
- `doctor_id` → `doctors(id)`

#### Relationship
- One **Doctor** can have many available time slots.
- Each available time slot belongs to one **Doctor**.


### Table: appointments

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| doctor_id | BIGINT | NOT NULL, FOREIGN KEY REFERENCES doctors(id) |
| patient_id | BIGINT | NOT NULL, FOREIGN KEY REFERENCES patients(id) |
| appointment_time | DATETIME | NOT NULL |
| status | INT | NOT NULL |

#### Primary Key
- `id`

#### Foreign Keys
- `doctor_id` → `doctors(id)`
- `patient_id` → `patients(id)`

#### Constraints
- `id` is the primary key and is automatically generated (`AUTO_INCREMENT`).
- `doctor_id` cannot be `NULL`.
- `patient_id` cannot be `NULL`.
- `appointment_time` should contain a future date and time. This is validated in the application using the `@Future` annotation.
- `status` cannot be `NULL`.
  - `0` = Scheduled
  - `1` = Completed

#### Derived Values (Not Stored in the Database)
The following values are calculated from `appointment_time` and are **not persisted** in the database:
- `endTime` = `appointment_time + 1 hour`
- `appointmentDate` = Date portion of `appointment_time`
- `appointmentTimeOnly` = Time portion of `appointment_time`

These values are computed in the application whenever needed.

#### Relationship
- One **Doctor** can have many **Appointments**.
- One **Patient** can have many **Appointments**.
- Each **Appointment** belongs to exactly one **Doctor** and one **Patient**.


### Table: admin

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(255) | NOT NULL |
| password | VARCHAR(255) | NOT NULL |

#### Primary Key
- `id`

#### Foreign Keys
- None

#### Constraints
- `id` is the primary key and is automatically generated (`AUTO_INCREMENT`).
- `username` cannot be `NULL`.
- `password` cannot be `NULL`.
- The `password` field is marked as `WRITE_ONLY` in the application, so it is stored in the database but is not included in JSON responses.
- Passwords should be stored as **hashed values** (e.g., BCrypt) rather than plain text.

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

#### Document Structure

| Field | Data Type | Constraints |
|--------|-----------|-------------|
| _id | ObjectId (String in Java) | Primary Key, Auto-generated |
| patientName | String | Required, 3–100 characters |
| appointmentId | Long | Required |
| medication | String | Required, 3–100 characters |
| dosage | String | Required |
| doctorNotes | String | Optional, Maximum 200 characters |

#### Validation Rules

- `patientName` cannot be null and must contain **3–100 characters**.
- `appointmentId` cannot be null.
- `medication` cannot be null and must contain **3–100 characters**.
- `dosage` cannot be null.
- `doctorNotes` is optional but must not exceed **200 characters**.
- Validation is performed in the Spring Boot application using Jakarta Validation annotations.

#### Example Document

```json
{
  "_id": "64abc1234567890abcdef12",
  "patientName": "Rahul Sharma",
  "appointmentId": 101,
  "medication": "Paracetamol",
  "dosage": "500 mg twice daily for 5 days",
  "doctorNotes": "Take the medicine after meals and drink plenty of water."
}
```

#### Design Considerations

- Each prescription document stores the details of **one prescription**.
- The `appointmentId` links the prescription to an appointment stored in the MySQL database.
- Only the patient's name is stored in the document. Additional patient information can be retrieved from MySQL using the associated appointment if needed.
- MongoDB's flexible schema allows new fields (such as `refillCount`, `attachments`, `allergies`, or `followUpDate`) to be added later without modifying existing documents.
