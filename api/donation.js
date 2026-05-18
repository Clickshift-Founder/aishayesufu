// api/donation.js
// Vercel serverless function — receives donation intent POST and sends to Airtable
// Table name: Donation Intents

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const {
    fullName,
    email,
    phone,
    donationAmount,
    customAmount,
    comment
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email and phone are required.' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Donation%20Intents`,
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
                'Donation Amount':  donationAmount || '',
                'Custom Amount':    customAmount || '',
                'Comment':          comment || '',
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

    return res.status(200).json({ success: true, message: 'Thank you! We will be in touch.' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}