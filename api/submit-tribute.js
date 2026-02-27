// Serverless function for Airtable submission
// Vercel API Route: /api/submit-tribute

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, relationship, message } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    const response = await fetch('https://api.airtable.com/v0/apptkgKLvld8gf7vw/Tributes', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer patdulhLa0opKSFd.d8ae9f100f3e3dcc29d85a7a5022f9498e19f83d490e3a10d5d5a6ffa5913218',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          Relationship: relationship || '',
          Message: message,
          Date: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Airtable error:', error);
      return res.status(500).json({ error: 'Airtable API error', details: error });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, record: data });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
