import {
  pgTable,
  serial,
  varchar,
  timestamp,
  date,
  integer,
  json,
  numeric,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";

// Define the user authentication table schema
export const user_authentications = pgTable("user_authentications", {
  userID: serial("userID").primaryKey(),
  email: varchar("email", { length: 100 }).notNull(), // Add length and notNull
  password: varchar("password", { length: 255 }).notNull(), // Add length and notNull
  role: varchar("role", { length: 50 }).notNull(), // Add length and notNull
  associatedID: varchar("associatedID", { length: 100 }), // FK to Patient or Staff, keep nullable
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define business_entities schema
export const business_entities = pgTable("business_entities", {
  businessID: serial("businessID").primaryKey(),
  userID: integer("userID")
    .references(() => user_authentications.userID)
    .notNull(),
  personInChargeName: varchar("personInChargeName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 100 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }).notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  businessRegistrationNumber: varchar("businessRegistrationNumber", {
    length: 50,
  }).notNull(),
  contractSigneeName: varchar("contractSigneeName", { length: 255 }).notNull(),
  contractSigneeNRIC: varchar("contractSigneeNRIC", { length: 50 }).notNull(),
  businessAddress: varchar("businessAddress", { length: 255 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  postalCode: varchar("postalCode", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define patients schema
export const patients = pgTable("patients", {
  patientID: serial("patientID").primaryKey(),
  userID: integer("userID")
    .references(() => user_authentications.userID)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactDetails: varchar("contactDetails", { length: 255 }),
  dob: date("dob"),
  gender: varchar("gender", { length: 10 }),
  address: varchar("address", { length: 255 }),
});

// Define physiotherapists schema
export const physiotherapists = pgTable("physiotherapists", {
  therapistID: serial("therapistID").primaryKey(),
  userID: integer("userID")
    .references(() => user_authentications.userID)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  contactDetails: varchar("contactDetails", { length: 255 }).notNull(),
  qualification: json("qualification"),
  experience: integer("experience"),

  businessID: integer("businessID")
    .references(() => business_entities.businessID)
    .notNull(),
});
// Define availabilities schema
export const availabilities = pgTable("availabilities", {
  availabilityID: serial("availabilityID").primaryKey(),
  therapistID: integer("therapistID")
    .references(() => physiotherapists.therapistID)
    .notNull(),
  dayOfWeek: varchar("dayOfWeek", { length: 10 }).notNull(), // e.g., "Monday"
  startTime: varchar("startTime", { length: 5 }),
  endTime: varchar("endTime", { length: 5 }),
  isAvailable: integer("isAvailable").default(1).notNull(), // 1 = available, 0 = not available
  specialDate: date("specialDate"), // For specific dates
});

// Define staffs schema
export const staffs = pgTable("staffs", {
  staffID: serial("staffID").primaryKey(),
  userID: integer("userID")
    .references(() => user_authentications.userID)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  businessID: integer("businessID")
    .references(() => business_entities.businessID)
    .notNull(),
});

// Define treatment_plans schema
export const treatment_plans = pgTable("treatment_plans", {
  planID: serial("planID").primaryKey(),
  description: varchar("description", { length: 500 }).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  patientID: integer("patientID")
    .references(() => patients.patientID)
    .notNull(),
  therapistID: integer("therapistID")
    .references(() => physiotherapists.therapistID)
    .notNull(),
});

export const payments = pgTable("payments", {
  paymentID: serial("paymentID").primaryKey(),
  appointmentID: integer("appointmentID")
    .references(() => appointments.appointmentID)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("paymentDate"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: varchar("status", { length: 50 }).notNull(),
  transactionReference: varchar("transactionReference", { length: 255 }),
  refundAmount: decimal("refundAmount", { precision: 10, scale: 2 }),
  refundDate: date("refundDate"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// Define appointments schema
export const appointments = pgTable("appointments", {
  appointmentID: serial("appointmentID").primaryKey(),
  appointmentDate: date("appointmentDate").notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  patientID: integer("patientID")
    .references(() => patients.patientID)
    .notNull(),
  therapistID: integer("therapistID")
    .references(() => physiotherapists.therapistID)
    .notNull(),
  staffID: integer("staffID")
    .references(() => staffs.staffID)
    .notNull(),
  planID: integer("planID").references(() => treatment_plans.planID),
});

// Define exercises schema
export const exercises = pgTable("exercises", {
  exerciseID: serial("exerciseID").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  planID: integer("planID")
    .references(() => treatment_plans.planID)
    .notNull(),
});
