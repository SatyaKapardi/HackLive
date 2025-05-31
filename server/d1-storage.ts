import { IStorage } from "./storage";
import { User, InsertUser, Hackathon, InsertHackathon } from "@shared/schema";

export class D1Storage implements IStorage {
  constructor(private db: D1Database) {}

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    return result as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
    return result as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?) RETURNING *"
    ).bind(user.username, user.password).first();
    return result as User;
  }

  async getHackathons(): Promise<Hackathon[]> {
    const results = await this.db.prepare("SELECT * FROM hackathons ORDER BY created_at DESC").all();
    return results.results.map(row => ({
      ...row,
      tags: JSON.parse(row.tags as string),
      createdAt: new Date(row.created_at as string)
    })) as Hackathon[];
  }

  async getHackathon(id: number): Promise<Hackathon | undefined> {
    const result = await this.db.prepare("SELECT * FROM hackathons WHERE id = ?").bind(id).first();
    if (!result) return undefined;
    
    return {
      ...result,
      tags: JSON.parse(result.tags as string),
      createdAt: new Date(result.created_at as string)
    } as Hackathon;
  }

  async createHackathon(hackathon: InsertHackathon): Promise<Hackathon> {
    const tagsJson = JSON.stringify(hackathon.tags);
    
    const result = await this.db.prepare(`
      INSERT INTO hackathons (
        name, organizer_name, start_date, end_date, location, format, description,
        prize_pool, registration_deadline, status, tags, experience_level, image_url, website_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      hackathon.name,
      hackathon.organizerName,
      hackathon.startDate,
      hackathon.endDate,
      hackathon.location,
      hackathon.format,
      hackathon.description,
      hackathon.prizePool,
      hackathon.registrationDeadline,
      hackathon.status,
      tagsJson,
      hackathon.experienceLevel,
      hackathon.imageUrl,
      hackathon.websiteUrl
    ).first();

    return {
      ...result,
      tags: JSON.parse(result.tags as string),
      createdAt: new Date(result.created_at as string)
    } as Hackathon;
  }

  async updateHackathon(id: number, updateData: Partial<InsertHackathon>): Promise<Hackathon | undefined> {
    const existing = await this.getHackathon(id);
    if (!existing) return undefined;

    const fields = [];
    const values = [];
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags') {
          fields.push('tags = ?');
          values.push(JSON.stringify(value));
        } else if (key === 'organizerName') {
          fields.push('organizer_name = ?');
          values.push(value);
        } else if (key === 'startDate') {
          fields.push('start_date = ?');
          values.push(value);
        } else if (key === 'endDate') {
          fields.push('end_date = ?');
          values.push(value);
        } else if (key === 'prizePool') {
          fields.push('prize_pool = ?');
          values.push(value);
        } else if (key === 'registrationDeadline') {
          fields.push('registration_deadline = ?');
          values.push(value);
        } else if (key === 'experienceLevel') {
          fields.push('experience_level = ?');
          values.push(value);
        } else if (key === 'imageUrl') {
          fields.push('image_url = ?');
          values.push(value);
        } else if (key === 'websiteUrl') {
          fields.push('website_url = ?');
          values.push(value);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    values.push(id);
    
    const result = await this.db.prepare(`
      UPDATE hackathons SET ${fields.join(', ')} WHERE id = ? RETURNING *
    `).bind(...values).first();

    return {
      ...result,
      tags: JSON.parse(result.tags as string),
      createdAt: new Date(result.created_at as string)
    } as Hackathon;
  }

  async deleteHackathon(id: number): Promise<boolean> {
    const result = await this.db.prepare("DELETE FROM hackathons WHERE id = ?").bind(id).run();
    return result.changes > 0;
  }
}