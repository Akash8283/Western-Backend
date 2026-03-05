require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(m.name);
                }
            });
        } else {
            console.log("No models found.");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

listModels();
