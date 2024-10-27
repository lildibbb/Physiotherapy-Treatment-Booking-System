import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  integer,
} from "drizzle-orm/pg-core";

// Define the hospital table schema first
export const hospitals = pgTable("hospitals", {
  hospitalID: serial("hospitalID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Add length and notNull
  location: varchar("location", { length: 255 }).notNull(), // Add length and notNull
  longitude: varchar("longitude", { length: 50 }).notNull(), // Add length and notNull
  latitude: varchar("latitude", { length: 50 }).notNull(), // Add length and notNull
  avatar: varchar("avatar", { length: 255 }), // Add avatar for profile images (can be nullable)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define the user authentication table schema
export const user_authentications = pgTable("user_authentications", {
  userID: serial("userID").primaryKey(),
  email: varchar("email", { length: 100 }).notNull(), // Add length and notNull
  password: varchar("password", { length: 255 }).notNull(), // Add length and notNull
  role: varchar("role", { length: 50 }).notNull(), // Add length and notNull
  associatedID: varchar("associatedID", { length: 100 }), // FK to Patient or Staff, keep nullable
  name: varchar("name", { length: 100 }),
  avatar: varchar("avatar", { length: 255 }), // Add avatar for profile images (can be nullable)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define the patient table schema
export const patients = pgTable("patients", {
  patientID: serial("patientID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Add length and notNull
  contactDetails: varchar("contactDetails", { length: 255 }).notNull(), // Add length and notNull
  dob: date("dob").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // Add length and notNull
  address: varchar("address", { length: 255 }).notNull(), // Add length and notNull
});

// Define the physiotherapist table schema
export const physiotherapists = pgTable("physiotherapists", {
  therapistID: serial("therapistID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Add length and notNull
  specialization: varchar("specialization", { length: 255 }).notNull(), // Add length and notNull
  contactDetails: varchar("contactDetails", { length: 255 }).notNull(), // Add length and notNull
  hospitalID: integer("hospitalID")
    .references(() => hospitals.hospitalID)
    .notNull(), // FK to Hospital, notNull
});

// Define the staff table schema
export const staffs = pgTable("staffs", {
  staffID: serial("staffID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Add length and notNull
  role: varchar("role", { length: 50 }).notNull(), // Add length and notNull
  hospitalID: integer("hospitalID")
    .references(() => hospitals.hospitalID)
    .notNull(), // FK to Hospital, notNull
});

// Define the treatment plan table schema
export const treatment_plans = pgTable("treatment_plans", {
  planID: serial("planID").primaryKey(),
  description: varchar("description", { length: 500 }).notNull(), // Add length and notNull
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  patientID: integer("patientID")
    .references(() => patients.patientID)
    .notNull(), // FK to Patient, notNull
});

// Define the appointment table schema
export const appointments = pgTable("appointments", {
  appointmentID: serial("appointmentID").primaryKey(),
  appointmentDate: date("appointmentDate").notNull(),
  time: varchar("time", { length: 10 }).notNull(), // Add length and notNull
  status: varchar("status", { length: 50 }).notNull(), // Add length and notNull
  patientID: integer("patientID")
    .references(() => patients.patientID)
    .notNull(), // FK to Patient, notNull
  therapistID: integer("therapistID")
    .references(() => physiotherapists.therapistID)
    .notNull(), // FK to Physiotherapist, notNull
  staffID: integer("staffID")
    .references(() => staffs.staffID)
    .notNull(), // FK to Staff, notNull
  userID: integer("userID") // Reference to user_authentications table
    .references(() => user_authentications.userID)
    .notNull(),
});

// Define the exercise table schema
export const exercises = pgTable("exercises", {
  exerciseID: serial("exerciseID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Add length and notNull
  description: varchar("description", { length: 500 }).notNull(), // Add length and notNull
  planID: integer("planID")
    .references(() => treatment_plans.planID)
    .notNull(), // FK to Treatment Plan, notNull
});
