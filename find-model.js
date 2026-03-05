require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function findWorkingModel() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API key found in .env");
        return;
    }

    try {
        console.log("Fetching model list from API...");
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const listData = await listRes.json();

        if (!listData.models) {
            console.error("No models found or error in list:", listData);
            return;
        }

        const genAI = new GoogleGenerativeAI(key);
        const models = listData.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));

        console.log(`Testing ${models.length} generative models...`);

        for (const modelName of models) {
            try {
                process.stdout.write(`Testing ${modelName}... `);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
                    generationConfig: { maxOutputTokens: 10 }
                });
                const text = result.response.text();
                console.log(`SUCCESS! Response: ${text.trim()}`);
                console.log(`\n>>> RECOMMENDED MODEL NAME: ${modelName} <<<\n`);
                return;
            } catch (e) {
                console.log(`FAILED: ${e.message.split('\n')[0].substring(0, 50)}...`);
            }
        }
        console.log("No working models found.");
    } catch (e) {
        console.error("Discovery error:", e.message);
    }
}

findWorkingModel();
