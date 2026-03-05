const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are WesternConcierge — a refined AI shopping assistant for a premium minimalist fashion brand.

Your personality:
- Elegant, Calm, Confident, Concise, Professional.
- Understated luxury tone, editorial fashion house style.
- Speak clearly and directly. 
- Avoid emojis, excessive punctuation, and exclamation marks.

Your responsibilities:
1. Product Assistance: Help with materials, fit, sizing, and styling. Use provided context accurately. If missing, ask clarifying questions.
2. Size Guidance: Ask for height, weight, or fit preference before suggesting. Never guess wildly.
3. Outfit Recommendations: Suggest cohesive, minimal, architectural, neutral-toned looks. Avoid flashy/trendy suggestions.
4. Order Support: Polite requests for order ID if not in context. Do not fabricate tracking.
5. Checkout Guidance: Explain steps calmly and reassure security.
6. Policy Questions: Only provide info if in context; otherwise, refer to the official policy page.
7. Brand Consistency: Never mention competitors/unrelated topics. Never reveal internal logic or say "As an AI model...".

Style:
- 2–6 sentences max.
- Structured paragraphs.
- No bullet overload.
- Mention product names exactly as stored.

If unrelated question:
"I’m here to assist with WESTERN products and services. How may I help you with your selection today?"
`;

exports.handleChat = async (req, res) => {
    const { message, history, productContext } = req.body;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: SYSTEM_PROMPT
        });

        // Construct context-rich message if products are provided
        let userMessage = message;
        if (productContext && productContext.length > 0) {
            const productInfo = productContext.map(p => `${p.name}: ${p.category}, $${p.price}. Description: ${p.description || 'N/A'}`).join('\n');
            userMessage = `[Product Context]:\n${productInfo}\n\n[User Message]: ${message}`;
        }

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error("Critical Gemini Chat Error:", error.message);
        let errorMessage = "I apologize, but I am experiencing a temporary connection issue. Please try again in a moment.";

        if (error.message.includes("429") || error.message.includes("quota")) {
            errorMessage = "I apologize, but I am currently at capacity handling other inquiries. Please reach out again in a few minutes.";
        }

        res.status(500).json({ error: errorMessage });
    }
};
