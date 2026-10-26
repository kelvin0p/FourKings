
const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await ai.responses.create({
            model: "gpt-4.1-mini",
            input: message
        });

        res.json({
            reply: response.output_text
        });
    } catch (error) {
        console.error("AI error:", error.message);
        res.status(500).json({
            error: "The AI could not respond. Check your API key and account access."
        });
    }
});

app.listen(PORT, () => {
    console.log(`FourKings AI running at http://localhost:${PORT}`);
});
