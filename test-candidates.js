require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkLikelyModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

    console.log("Starting model check...");
    for (const m of candidateModels) {
        try {
            console.log(`Checking ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`[SUCCESS] Model ${m} is working.`);
            return; // Stop at the first working one
        } catch (e) {
            console.log(`[FAILED] Model ${m}: ${e.message}`);
        }
    }
}

checkLikelyModels();
