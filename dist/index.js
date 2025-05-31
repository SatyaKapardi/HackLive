// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  hackathons;
  userId;
  hackathonId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.hackathons = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.hackathonId = 1;
    this.createUser({
      username: "nameismike2002@gmail.com",
      password: "Krushna@2002"
      // In a production app, this would be hashed
    });
    this.initializeHackathons();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getHackathons() {
    return Array.from(this.hackathons.values());
  }
  async getHackathon(id) {
    return this.hackathons.get(id);
  }
  async createHackathon(insertHackathon) {
    const id = this.hackathonId++;
    const now = /* @__PURE__ */ new Date();
    const processedHackathon = {
      ...insertHackathon,
      status: insertHackathon.status || "Open",
      prizePool: insertHackathon.prizePool || null,
      registrationDeadline: insertHackathon.registrationDeadline || null,
      imageUrl: insertHackathon.imageUrl || null,
      websiteUrl: insertHackathon.websiteUrl || null
    };
    const hackathon = {
      ...processedHackathon,
      id,
      createdAt: now
    };
    this.hackathons.set(id, hackathon);
    return hackathon;
  }
  async updateHackathon(id, updateData) {
    const existingHackathon = this.hackathons.get(id);
    if (!existingHackathon) return void 0;
    const updatedHackathon = {
      ...existingHackathon,
      ...updateData
    };
    this.hackathons.set(id, updatedHackathon);
    return updatedHackathon;
  }
  async deleteHackathon(id) {
    return this.hackathons.delete(id);
  }
  // Initialize with sample hackathon data
  initializeHackathons() {
    const demoHackathons = [
      // International hackathons for better location sorting testing
      {
        name: "Tokyo Tech Fest",
        organizerName: "Japan Tech Association",
        startDate: "2023-08-10",
        endDate: "2023-08-12",
        location: "Japan, Tokyo",
        format: "In-person",
        description: "Join the largest tech hackathon in Japan with top tech companies and mentors from across Asia.",
        prizePool: 3e4,
        registrationDeadline: "2023-07-25",
        status: "Open",
        tags: ["AI", "Robotics", "IoT"],
        experienceLevel: "Intermediate",
        imageUrl: null,
        websiteUrl: "https://tokyotechfest.jp"
      },
      {
        name: "Paris Innovation Hackathon",
        organizerName: "French Tech Alliance",
        startDate: "2023-09-22",
        endDate: "2023-09-24",
        location: "France, Paris",
        format: "In-person",
        description: "A weekend of innovation in the heart of Paris. Connect with Europe's top tech talent.",
        prizePool: 2e4,
        registrationDeadline: "2023-09-10",
        status: "Open",
        tags: ["FinTech", "Smart City", "All Levels"],
        experienceLevel: "All Levels",
        imageUrl: null,
        websiteUrl: "https://parishack.fr"
      },
      {
        name: "Singapore AI Summit Hackathon",
        organizerName: "Singapore Digital",
        startDate: "2023-08-28",
        endDate: "2023-08-30",
        location: "Singapore, Singapore",
        format: "Hybrid",
        description: "Build AI solutions for real-world challenges in healthcare, finance, and education.",
        prizePool: 35e3,
        registrationDeadline: "2023-08-15",
        status: "Open",
        tags: ["AI/ML", "Data Science", "Advanced"],
        experienceLevel: "Advanced",
        imageUrl: null,
        websiteUrl: "https://sgaisummit.sg"
      },
      {
        name: "Sydney Web3 Hackathon",
        organizerName: "Blockchain Australia",
        startDate: "2023-10-15",
        endDate: "2023-10-17",
        location: "Australia, Sydney",
        format: "In-person",
        description: "Australia's premier blockchain and Web3 development competition with global sponsors.",
        prizePool: 25e3,
        registrationDeadline: "2023-10-01",
        status: "Open",
        tags: ["Blockchain", "Web3", "Cryptocurrency"],
        experienceLevel: "Intermediate",
        imageUrl: null,
        websiteUrl: "https://sydneyweb3hack.com.au"
      },
      {
        name: "Virtual AR/VR Global Challenge",
        organizerName: "Metaverse Pioneers",
        startDate: "2023-09-05",
        endDate: "2023-09-12",
        location: "Remote, Virtual",
        format: "Virtual",
        description: "Push the boundaries of AR/VR technology with a week-long virtual hackathon. Open to teams worldwide.",
        prizePool: 4e4,
        registrationDeadline: "2023-08-25",
        status: "Open",
        tags: ["AR/VR", "Metaverse", "Gaming"],
        experienceLevel: "All Levels",
        imageUrl: null,
        websiteUrl: "https://arvrglobalchallenge.com"
      },
      {
        name: "MLH Summer Hackathon",
        organizerName: "Major League Hacking",
        startDate: "2023-07-15",
        endDate: "2023-07-17",
        location: "USA, San Francisco",
        format: "In-person",
        description: "Join us for a weekend of hacking, learning, and fun! Build projects with cutting-edge tech and compete for prizes.",
        prizePool: 1e4,
        registrationDeadline: "2023-07-10",
        status: "Open",
        tags: ["AI/ML", "Web3", "Beginner Friendly"],
        experienceLevel: "Beginner",
        imageUrl: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://mlh.io"
      },
      {
        name: "TechCrunch Disrupt Hackathon",
        organizerName: "TechCrunch",
        startDate: "2023-08-05",
        endDate: "2023-08-07",
        location: "USA, New York",
        format: "In-person",
        description: "The official hackathon of TechCrunch Disrupt. Launch your startup idea in 48 hours!",
        prizePool: 25e3,
        registrationDeadline: "2023-07-20",
        status: "Closing Soon",
        tags: ["Startup", "FinTech", "All Levels"],
        experienceLevel: "All Levels",
        imageUrl: "https://images.unsplash.com/photo-1606241526291-ed6a8a502738?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://techcrunch.com/events/disrupt-sf-2023/hackathon/"
      },
      {
        name: "Google Cloud Hackathon",
        organizerName: "Google Developers",
        startDate: "2023-07-20",
        endDate: "2023-07-25",
        location: "Remote, Virtual",
        format: "Virtual",
        description: "Build innovative solutions using Google Cloud technologies. Multiple tracks available.",
        prizePool: 15e3,
        registrationDeadline: "2023-07-15",
        status: "Open",
        tags: ["Cloud", "DevOps", "Intermediate"],
        experienceLevel: "Intermediate",
        imageUrl: "https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://cloud.google.com/events"
      },
      {
        name: "HackEd Education Hackathon",
        organizerName: "EdTech Foundation",
        startDate: "2023-07-29",
        endDate: "2023-07-30",
        location: "USA, Boston",
        format: "Hybrid",
        description: "Reimagine the future of education. Build tools for students, teachers, and parents.",
        prizePool: 5e3,
        registrationDeadline: "2023-07-25",
        status: "Open",
        tags: ["EdTech", "AI", "Beginner Friendly"],
        experienceLevel: "Beginner",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://edtechfoundation.org/hacked"
      },
      {
        name: "Climate Hack",
        organizerName: "Sustainability Foundation",
        startDate: "2023-08-12",
        endDate: "2023-08-14",
        location: "Remote, Virtual",
        format: "Virtual",
        description: "Tackle climate change challenges with technology. Open to individuals and teams globally.",
        prizePool: 7500,
        registrationDeadline: "2023-08-05",
        status: "Open",
        tags: ["Climate Tech", "Sustainability", "All Levels"],
        experienceLevel: "All Levels",
        imageUrl: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://climatehack.io"
      },
      {
        name: "ETH Global Hackathon",
        organizerName: "Ethereum Foundation",
        startDate: "2023-08-25",
        endDate: "2023-08-27",
        location: "Germany, Berlin",
        format: "In-person",
        description: "Build the future of decentralized applications on Ethereum. Mentorship from top blockchain engineers.",
        prizePool: 5e4,
        registrationDeadline: "2023-08-15",
        status: "Open",
        tags: ["Blockchain", "Web3", "Intermediate"],
        experienceLevel: "Intermediate",
        imageUrl: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80",
        websiteUrl: "https://ethglobal.com"
      },
      {
        name: "Healthcare Innovation Hackathon",
        organizerName: "MedTech Alliance",
        startDate: "2023-09-08",
        endDate: "2023-09-10",
        location: "USA, Chicago",
        format: "In-person",
        description: "Create solutions for healthcare challenges. Collaboration with medical professionals.",
        prizePool: 12e3,
        registrationDeadline: "2023-08-25",
        status: "Open",
        tags: ["HealthTech", "AI", "Advanced"],
        experienceLevel: "Advanced",
        imageUrl: null,
        websiteUrl: "https://medtechhack.org"
      },
      {
        name: "Game Development Jam",
        organizerName: "Unity Technologies",
        startDate: "2023-07-22",
        endDate: "2023-07-24",
        location: "Remote, Virtual",
        format: "Virtual",
        description: "Create a game in 48 hours using Unity. Open to developers of all skill levels.",
        prizePool: 8e3,
        registrationDeadline: "2023-07-20",
        status: "Closing Soon",
        tags: ["Game Dev", "Unity", "All Levels"],
        experienceLevel: "All Levels",
        imageUrl: null,
        websiteUrl: "https://unity.com/events"
      },
      {
        name: "Cybersecurity Challenge",
        organizerName: "SecureNet Foundation",
        startDate: "2023-08-19",
        endDate: "2023-08-20",
        location: "USA, Washington DC",
        format: "Hybrid",
        description: "Test and build security solutions. Penetration testing, defense mechanisms, and more.",
        prizePool: 15e3,
        registrationDeadline: "2023-08-10",
        status: "Open",
        tags: ["Security", "Networking", "Advanced"],
        experienceLevel: "Advanced",
        imageUrl: null,
        websiteUrl: "https://securenethack.com"
      },
      {
        name: "Social Impact Hackathon",
        organizerName: "Tech For Good",
        startDate: "2023-09-15",
        endDate: "2023-09-17",
        location: "USA, Seattle",
        format: "In-person",
        description: "Build technology solutions for nonprofits and social enterprises. Make a difference!",
        prizePool: 1e4,
        registrationDeadline: "2023-09-01",
        status: "Open",
        tags: ["Social Impact", "Nonprofit", "Beginner Friendly"],
        experienceLevel: "Beginner",
        imageUrl: null,
        websiteUrl: "https://techforgood.org/hackathon"
      },
      {
        name: "AR/VR Innovation Challenge",
        organizerName: "Immersive Tech Association",
        startDate: "2023-10-07",
        endDate: "2023-10-09",
        location: "USA, Los Angeles",
        format: "In-person",
        description: "Push the boundaries of augmented and virtual reality. Hardware provided to participants.",
        prizePool: 2e4,
        registrationDeadline: "2023-09-20",
        status: "Open",
        tags: ["AR/VR", "Gaming", "Intermediate"],
        experienceLevel: "Intermediate",
        imageUrl: null,
        websiteUrl: "https://arvrhack.tech"
      },
      {
        name: "Student Developers Hackathon",
        organizerName: "GitHub Education",
        startDate: "2023-08-05",
        endDate: "2023-08-06",
        location: "Remote, Virtual",
        format: "Virtual",
        description: "For students worldwide. Learn, build, and connect with tech companies.",
        prizePool: 5e3,
        registrationDeadline: "2023-07-30",
        status: "Open",
        tags: ["Student", "Open Source", "Beginner Friendly"],
        experienceLevel: "Beginner",
        imageUrl: null,
        websiteUrl: "https://education.github.com/hackathon"
      }
    ];
    demoHackathons.forEach((hackathon) => {
      this.createHackathon(hackathon);
    });
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizerName: text("organizer_name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  location: text("location").notNull(),
  format: text("format").notNull(),
  // In-person, Virtual, Hybrid
  description: text("description").notNull(),
  prizePool: integer("prize_pool"),
  // Nullable
  registrationDeadline: date("registration_deadline"),
  status: text("status").notNull().default("Open"),
  // Open, Closed, Closing Soon
  tags: text("tags").array().notNull(),
  experienceLevel: text("experience_level").notNull(),
  // Beginner, Intermediate, Advanced, All Levels
  imageUrl: text("image_url"),
  // Nullable
  websiteUrl: text("website_url"),
  // Nullable
  createdAt: timestamp("created_at").defaultNow()
});
var insertHackathonSchema = createInsertSchema(hackathons).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
var authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid authorization header" });
  }
  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Authentication failed" });
  }
};
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
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
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
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
  app2.get("/api/auth/status", authenticateAdmin, (req, res) => {
    const user = req.user;
    const { password: _, ...userInfo } = user;
    res.json({
      authenticated: true,
      user: userInfo
    });
  });
  app2.get("/api/hackathons", async (req, res) => {
    try {
      const hackathons2 = await storage.getHackathons();
      res.json(hackathons2);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
      res.status(500).json({ message: "Failed to fetch hackathons" });
    }
  });
  app2.get("/api/hackathons/:id", async (req, res) => {
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
  app2.post("/api/hackathons", authenticateAdmin, async (req, res) => {
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
  app2.patch("/api/hackathons/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hackathon ID" });
      }
      const existingHackathon = await storage.getHackathon(id);
      if (!existingHackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }
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
  app2.delete("/api/hackathons/:id", authenticateAdmin, async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
