export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    // 🔑 TOKEN AQ. AKTIF MILIK EVAN
    const TOKEN_AQ = "AQ.Ab8RN6K9v29O7G2DInIqxZWJ7n93UVnHh7Fgccx"; 

    try {
        const googleUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
        
        const response = await fetch(googleUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN_AQ}`
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(response.status).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ hasil: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ error: 'Gagal mengekstrak teks dari Google.' });
        }

    } catch (err) {
        return res.status(500).json({ error: 'Error Jaringan Server: ' + err.message });
    }
}
