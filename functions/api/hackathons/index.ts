interface Env {
  DB: D1Database;
}

interface Hackathon {
  id: number;
  name: string;
  organizer_name: string;
  start_date: string;
  end_date: string;
  location: string;
  format: string;
  description: string;
  prize_pool?: number;
  registration_deadline?: string;
  status: string;
  tags: string; // JSON string
  experience_level: string;
  image_url?: string;
  website_url?: string;
  created_at?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const results = await context.env.DB.prepare("SELECT * FROM hackathons ORDER BY created_at DESC").all();
    
    const hackathons = results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      organizerName: row.organizer_name,
      startDate: row.start_date,
      endDate: row.end_date,
      location: row.location,
      format: row.format,
      description: row.description,
      prizePool: row.prize_pool,
      registrationDeadline: row.registration_deadline,
      status: row.status,
      tags: JSON.parse(row.tags),
      experienceLevel: row.experience_level,
      imageUrl: row.image_url,
      websiteUrl: row.website_url,
      createdAt: new Date(row.created_at)
    }));
    
    return new Response(JSON.stringify(hackathons), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch hackathons' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // Check authorization
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simple basic auth check
    const expectedAuth = 'Basic ' + btoa('nameismike2002@gmail.com:Krushna@2002');
    if (authHeader !== expectedAuth) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await context.request.json();
    
    // Basic validation
    if (!data.name || !data.organizerName || !data.startDate || !data.endDate || !data.location) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const tagsJson = JSON.stringify(data.tags || []);
    
    const result = await context.env.DB.prepare(`
      INSERT INTO hackathons (
        name, organizer_name, start_date, end_date, location, format, description,
        prize_pool, registration_deadline, status, tags, experience_level, image_url, website_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      data.name,
      data.organizerName,
      data.startDate,
      data.endDate,
      data.location,
      data.format,
      data.description,
      data.prizePool,
      data.registrationDeadline,
      data.status || 'Open',
      tagsJson,
      data.experienceLevel,
      data.imageUrl,
      data.websiteUrl
    ).first();

    const hackathon = {
      ...result,
      tags: JSON.parse(result.tags as string),
      createdAt: new Date(result.created_at as string)
    };
    
    return new Response(JSON.stringify(hackathon), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create hackathon',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
