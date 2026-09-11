import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  Enums                                                              */
/* ------------------------------------------------------------------ */

export const leadTypeEnum = pgEnum("lead_type", [
  "beratung",
  "termin",
  "tarifcheck",
  "bewerbung",
  "kontakt",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "neu",
  "kontaktiert",
  "termin_bestaetigt",
  "in_beratung",
  "abgeschlossen",
  "verloren",
]);

export const employeeRoleEnum = pgEnum("employee_role", ["admin", "berater"]);

/* ------------------------------------------------------------------ */
/*  Advisors (public profiles)                                         */
/* ------------------------------------------------------------------ */

export const advisors = pgTable("advisors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  regions: text("regions").array().notNull().default([]),
  topics: text("topics").array().notNull().default([]),
  bio: text("bio").notNull(),
  quote: text("quote"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  initials: text("initials").notNull(),
  isFounder: boolean("is_founder").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Employees (portal accounts)                                        */
/* ------------------------------------------------------------------ */

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: employeeRoleEnum("role").notNull().default("berater"),
  advisorId: integer("advisor_id").references(() => advisors.id, { onDelete: "set null" }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Leads / appointment requests / applications                        */
/* ------------------------------------------------------------------ */

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  type: leadTypeEnum("type").notNull().default("beratung"),
  status: leadStatusEnum("status").notNull().default("neu"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  topic: text("topic"),
  region: text("region"),
  situation: text("situation"),
  message: text("message"),
  preferredChannel: text("preferred_channel"),
  preferredTime: text("preferred_time"),
  advisorId: integer("advisor_id").references(() => advisors.id, { onDelete: "set null" }),
  assignedEmployeeId: integer("assigned_employee_id").references(() => employees.id, {
    onDelete: "set null",
  }),
  source: text("source"),
  meta: jsonb("meta").$type<Record<string, unknown>>(),
  confirmedSlot: text("confirmed_slot"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").references(() => employees.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  kind: text("kind").notNull().default("note"), // note | system
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Team chat                                                          */
/* ------------------------------------------------------------------ */

export const teamMessages = pgTable("team_messages", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Advisor = typeof advisors.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LeadNote = typeof leadNotes.$inferSelect;
export type TeamMessage = typeof teamMessages.$inferSelect;
export type LeadType = (typeof leadTypeEnum.enumValues)[number];
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];
