// api/volunteer.js
// Vercel serverless function — receives volunteer form POST and sends to Airtable
// Table name: Volunteers

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers — allow requests from your own domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const {
    fullName,
    email,
    phone,
    whatsapp,
    areaCouncil,
    ward,
    ageGroup,
    volunteerRole,
    availability,
    skills,
    whyJoining,
    howHeard
  } = req.body;

  // Basic validation
  if (!fullName || !email || !phone || !areaCouncil || !ward) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Volunteers`,
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
                'Full Name':        fullName,
                'Email':            email,
                'Phone Number':     phone,
                'WhatsApp Number':  whatsapp || '',
                'Area Council':     areaCouncil,
                'Ward / Community': ward,
                'Age Group':        ageGroup || '',
                'Volunteer Role':   volunteerRole || 'General Volunteer',
                'Availability':     Array.isArray(availability) ? availability : [],
                'Skills & Interests': Array.isArray(skills) ? skills : [],
                'Why They\'re Joining': whyJoining || '',
                'How They Heard':   howHeard || '',
                'Submitted At':     new Date().toISOString()
              }
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable error:', err);
      return res.status(500).json({ error: 'Failed to save. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Welcome to the movement!' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
