-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  location TEXT NOT NULL,
  format TEXT NOT NULL,
  description TEXT NOT NULL,
  prize_pool INTEGER,
  registration_deadline TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  tags TEXT NOT NULL, -- JSON array as string
  experience_level TEXT NOT NULL,
  image_url TEXT,
  website_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT OR IGNORE INTO users (username, password) 
VALUES ('nameismike2002@gmail.com', 'Krushna@2002');

-- Insert sample hackathon data
INSERT OR IGNORE INTO hackathons (
  name, organizer_name, start_date, end_date, location, format, description,
  prize_pool, registration_deadline, status, tags, experience_level, image_url, website_url
) VALUES 
('Tokyo Tech Fest', 'Japan Tech Association', '2023-08-10', '2023-08-12', 'Japan, Tokyo', 'In-person', 
 'Join the largest tech hackathon in Japan with top tech companies and mentors from across Asia.',
 30000, '2023-07-25', 'Open', '["AI", "Robotics", "IoT"]', 'Intermediate', null, 'https://tokyotechfest.jp'),

('Paris Innovation Hackathon', 'French Tech Alliance', '2023-09-22', '2023-09-24', 'France, Paris', 'In-person',
 'A weekend of innovation in the heart of Paris. Connect with Europe''s top tech talent.',
 20000, '2023-09-10', 'Open', '["FinTech", "Smart City", "All Levels"]', 'All Levels', null, 'https://parishack.fr'),

('Singapore AI Summit Hackathon', 'Singapore Digital', '2023-08-28', '2023-08-30', 'Singapore, Singapore', 'Hybrid',
 'Build AI solutions for real-world challenges in healthcare, finance, and education.',
 35000, '2023-08-15', 'Open', '["AI/ML", "Data Science", "Advanced"]', 'Advanced', null, 'https://sgaisummit.sg'),

('Sydney Web3 Hackathon', 'Blockchain Australia', '2023-10-15', '2023-10-17', 'Australia, Sydney', 'In-person',
 'Australia''s premier blockchain and Web3 development competition with global sponsors.',
 25000, '2023-10-01', 'Open', '["Blockchain", "Web3", "Cryptocurrency"]', 'Intermediate', null, 'https://sydneyweb3hack.com.au'),

('Virtual AR/VR Global Challenge', 'Metaverse Pioneers', '2023-09-05', '2023-09-12', 'Remote, Virtual', 'Virtual',
 'Push the boundaries of AR/VR technology with a week-long virtual hackathon. Open to teams worldwide.',
 40000, '2023-08-25', 'Open', '["AR/VR", "Metaverse", "Gaming"]', 'All Levels', null, 'https://arvrglobalchallenge.com'),

('MLH Summer Hackathon', 'Major League Hacking', '2023-07-15', '2023-07-17', 'USA, San Francisco', 'In-person',
 'Join us for a weekend of hacking, learning, and fun! Build projects with cutting-edge tech and compete for prizes.',
 10000, '2023-07-10', 'Open', '["AI/ML", "Web3", "Beginner Friendly"]', 'Beginner', 
 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80', 'https://mlh.io'),

('TechCrunch Disrupt Hackathon', 'TechCrunch', '2023-08-05', '2023-08-07', 'USA, New York', 'In-person',
 'The official hackathon of TechCrunch Disrupt. Launch your startup idea in 48 hours!',
 25000, '2023-07-20', 'Closing Soon', '["Startup", "FinTech", "All Levels"]', 'All Levels',
 'https://images.unsplash.com/photo-1606241526291-ed6a8a502738?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80', 
 'https://techcrunch.com/events/disrupt-sf-2023/hackathon/'),

('Google Cloud Hackathon', 'Google Developers', '2023-07-20', '2023-07-25', 'Remote, Virtual', 'Virtual',
 'Build innovative solutions using Google Cloud technologies. Multiple tracks available.',
 15000, '2023-07-15', 'Open', '["Cloud", "DevOps", "Intermediate"]', 'Intermediate',
 'https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80', 
 'https://cloud.google.com/events');