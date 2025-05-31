import { users, type User, type InsertUser, hackathons, type Hackathon, type InsertHackathon } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hackathon methods
  getHackathons(): Promise<Hackathon[]>;
  getHackathon(id: number): Promise<Hackathon | undefined>;
  createHackathon(hackathon: InsertHackathon): Promise<Hackathon>;
  updateHackathon(id: number, hackathon: Partial<InsertHackathon>): Promise<Hackathon | undefined>;
  deleteHackathon(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hackathons: Map<number, Hackathon>;
  private userId: number;
  private hackathonId: number;

  constructor() {
    this.users = new Map();
    this.hackathons = new Map();
    this.userId = 1;
    this.hackathonId = 1;
    
    // Initialize admin user
    this.createUser({
      username: "nameismike2002@gmail.com",
      password: "Krushna@2002" // In a production app, this would be hashed
    });
    
    // Add some sample hackathon data
    this.initializeHackathons();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHackathons(): Promise<Hackathon[]> {
    return Array.from(this.hackathons.values());
  }

  async getHackathon(id: number): Promise<Hackathon | undefined> {
    return this.hackathons.get(id);
  }

  async createHackathon(insertHackathon: InsertHackathon): Promise<Hackathon> {
    const id = this.hackathonId++;
    const now = new Date();
    
    // Ensure hackathon has the required fields
    const processedHackathon = {
      ...insertHackathon,
      status: insertHackathon.status || "Open",
      prizePool: insertHackathon.prizePool || null,
      registrationDeadline: insertHackathon.registrationDeadline || null,
      imageUrl: insertHackathon.imageUrl || null,
      websiteUrl: insertHackathon.websiteUrl || null
    };
    
    const hackathon: Hackathon = { 
      ...processedHackathon, 
      id,
      createdAt: now
    };
    this.hackathons.set(id, hackathon);
    return hackathon;
  }

  async updateHackathon(id: number, updateData: Partial<InsertHackathon>): Promise<Hackathon | undefined> {
    const existingHackathon = this.hackathons.get(id);
    if (!existingHackathon) return undefined;

    const updatedHackathon: Hackathon = {
      ...existingHackathon,
      ...updateData
    };
    this.hackathons.set(id, updatedHackathon);
    return updatedHackathon;
  }

  async deleteHackathon(id: number): Promise<boolean> {
    return this.hackathons.delete(id);
  }

  // Initialize with sample hackathon data
  private initializeHackathons() {
    // Sample hackathon data with string dates
    const demoHackathons: InsertHackathon[] = [
      // International hackathons for better location sorting testing
      {
        name: "Tokyo Tech Fest",
        organizerName: "Japan Tech Association",
        startDate: "2023-08-10",
        endDate: "2023-08-12",
        location: "Japan, Tokyo",
        format: "In-person",
        description: "Join the largest tech hackathon in Japan with top tech companies and mentors from across Asia.",
        prizePool: 30000,
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
        prizePool: 20000,
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
        prizePool: 35000,
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
        prizePool: 25000,
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
        prizePool: 40000,
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
        prizePool: 10000,
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
        prizePool: 25000,
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
        prizePool: 15000,
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
        prizePool: 5000,
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
        prizePool: 50000,
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
        prizePool: 12000,
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
        prizePool: 8000,
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
        prizePool: 15000,
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
        prizePool: 10000,
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
        prizePool: 20000,
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
        prizePool: 5000,
        registrationDeadline: "2023-07-30",
        status: "Open",
        tags: ["Student", "Open Source", "Beginner Friendly"],
        experienceLevel: "Beginner",
        imageUrl: null,
        websiteUrl: "https://education.github.com/hackathon"
      }
    ];

    // Add hackathons to storage
    demoHackathons.forEach(hackathon => {
      this.createHackathon(hackathon);
    });
  }
}

export const storage = new MemStorage();
