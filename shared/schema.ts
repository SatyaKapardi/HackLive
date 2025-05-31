import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizerName: text("organizer_name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  location: text("location").notNull(),
  format: text("format").notNull(), // In-person, Virtual, Hybrid
  description: text("description").notNull(),
  prizePool: integer("prize_pool"), // Nullable
  registrationDeadline: date("registration_deadline"),
  status: text("status").notNull().default("Open"), // Open, Closed, Closing Soon
  tags: text("tags").array().notNull(),
  experienceLevel: text("experience_level").notNull(), // Beginner, Intermediate, Advanced, All Levels
  imageUrl: text("image_url"), // Nullable
  websiteUrl: text("website_url"), // Nullable
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHackathonSchema = createInsertSchema(hackathons).omit({
  id: true,
  createdAt: true,
});

export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type Hackathon = typeof hackathons.$inferSelect;
