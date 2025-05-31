import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHackathonSchema, insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

// Authentication middleware
const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Get the auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid authorization header" });
  }
  
  // Extract credentials
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Check if user exists and credentials match
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }
    
    // Attach user to request for potential later use
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Authentication failed" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().email(),
        password: z.string().min(6)
      });
      
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const { username, password } = result.data;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // If login is successful, return user info (excluding password)
      const { password: _, ...userInfo } = user;
      res.json({ 
        message: "Login successful", 
        user: userInfo 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed due to server error" });
    }
  });
  
  // Check auth status
  app.get("/api/auth/status", authenticateAdmin, (req, res) => {
    const user = (req as any).user;
    const { password: _, ...userInfo } = user;
    res.json({ 
      authenticated: true, 
      user: userInfo 
    });
  });
  
  // API Routes
  
  // Get all hackathons
  app.get("/api/hackathons", async (req, res) => {
    try {
      const hackathons = await storage.getHackathons();
      res.json(hackathons);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
      res.status(500).json({ message: "Failed to fetch hackathons" });
    }
  });

  // Get a specific hackathon by ID
  app.get("/api/hackathons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hackathon ID" });
      }

      const hackathon = await storage.getHackathon(id);
      if (!hackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }

      res.json(hackathon);
    } catch (error) {
      console.error("Error fetching hackathon:", error);
      res.status(500).json({ message: "Failed to fetch hackathon" });
    }
  });

  // Create a new hackathon - protected by admin auth
  app.post("/api/hackathons", authenticateAdmin, async (req, res) => {
    try {
      const result = insertHackathonSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const hackathon = await storage.createHackathon(result.data);
      res.status(201).json(hackathon);
    } catch (error) {
      console.error("Error creating hackathon:", error);
      res.status(500).json({ message: "Failed to create hackathon" });
    }
  });

  // Update an existing hackathon - protected by admin auth
  app.patch("/api/hackathons/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hackathon ID" });
      }

      const existingHackathon = await storage.getHackathon(id);
      if (!existingHackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }

      // Partial validation of update data
      const result = insertHackathonSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const updatedHackathon = await storage.updateHackathon(id, result.data);
      res.json(updatedHackathon);
    } catch (error) {
      console.error("Error updating hackathon:", error);
      res.status(500).json({ message: "Failed to update hackathon" });
    }
  });

  // Delete a hackathon - protected by admin auth
  app.delete("/api/hackathons/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hackathon ID" });
      }

      const existingHackathon = await storage.getHackathon(id);
      if (!existingHackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }

      const success = await storage.deleteHackathon(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete hackathon" });
      }
    } catch (error) {
      console.error("Error deleting hackathon:", error);
      res.status(500).json({ message: "Failed to delete hackathon" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
