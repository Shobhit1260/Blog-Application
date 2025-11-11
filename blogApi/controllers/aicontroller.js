const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        // If you need a custom base URL, set baseURL here; otherwise remove it.
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
const generateArticle = async (req, res) => {
    try{
                const { prompt } = req.body;
                // optional: you can access req.user if needed (protect middleware sets it)

                const response = await openai.chat.completions.create({
                     model: "gemini-2.0-flash",
                     messages: [ { role: "user", content: prompt } ],
                     temperature: 0.7,
                     max_tokens: 1600,
                });

                const content = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
                    ? response.choices[0].message.content
                    : 'No content generated';

                if (!content) {
                    return res.json({ success: false, message: 'No content generated' });
                }

                return res.json({ success: true, content });
   }
    catch(error){
            return res.json({ success: false, message: 'Error in writing article', error: error.message });
    }
}

module.exports = { generateArticle };