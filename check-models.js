require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function check() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
check();
