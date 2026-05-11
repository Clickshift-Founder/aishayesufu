// api/newsletter.js
// Vercel serverless function — receives newsletter signup POST and sends to Airtable
// Table name: Newsletter Subscribers

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { email, source } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Newsletter%20Subscribers`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Email':        email,
                'Source':       source || 'Homepage',
                'Submitted At': new Date().toISOString()
              }
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      // If it's a duplicate email (Airtable doesn't enforce uniqueness by default,
      // but if you add a unique field constraint it will error here)
      console.error('Airtable error:', err);
      return res.status(500).json({ error: 'Could not subscribe. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Subscribed successfully!' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
