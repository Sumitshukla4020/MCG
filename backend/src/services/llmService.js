import fetch from 'node-fetch';

export const generateCodeFromLLM = async (prompt) => {
  const geminiPrompt = `
You are a UI component generator. Given a description, return only 3 fields in JSON:
- "jsx": React component (TSX preferred)
- "css": relevant CSS styles
- "message": short description

Prompt: ${prompt}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: geminiPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response (from service):", data);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No content returned by Gemini');
    }

    const cleaned = text.replace(/^```json\n|```$/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", cleaned);
      throw new Error('Invalid JSON format from Gemini');
    }

    return parsed;
  } catch (err) {
    console.error('generateCodeFromLLM error:', err.message || err);
    throw err;
  }
};
