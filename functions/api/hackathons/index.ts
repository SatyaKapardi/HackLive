import { D1Storage } from '../../../server/d1-storage';
import { insertHackathonSchema } from '../../../shared/schema';

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const storage = new D1Storage(context.env.DB);
    const hackathons = await storage.getHackathons();
    
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
    
    // Validate the data
    const validatedData = insertHackathonSchema.parse(data);
    
    const storage = new D1Storage(context.env.DB);
    const hackathon = await storage.createHackathon(validatedData);
    
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