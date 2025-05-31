import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const hackathons = sqliteTable("hackathons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  organizerName: text("organizer_name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  location: text("location").notNull(),
  format: text("format").notNull(), // In-person, Virtual, Hybrid
  description: text("description").notNull(),
  prizePool: integer("prize_pool"), // Nullable
  registrationDeadline: text("registration_deadline"),
  status: text("status").notNull().default("Open"), // Open, Closed, Closing Soon
  tags: text("tags").notNull(),
  experienceLevel: text("experience_level").notNull(), // Beginner, Intermediate, Advanced, All Levels
  imageUrl: text("image_url"), // Nullable
  websiteUrl: text("website_url"), // Nullable
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const insertHackathonSchema = createInsertSchema(hackathons).omit({
  id: true,
  createdAt: true,
}).extend({
  tags: z.array(z.string()),
});

export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type Hackathon = typeof hackathons.$inferSelect & {
  tags: string[];
};
