import Component from '../models/Component.js'; 
import { generateCodeFromLLM } from '../services/llmService.js'; 
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

export const generateCode = async (req, res) => {
  const { sessionId, prompt } = req.body;

  if (!prompt || !sessionId) {
    return res.status(400).json({ error: 'Prompt and sessionId are required' });
  }

  try {
    const parsed = await generateCodeFromLLM(prompt);

    await Component.create({
      sessionId,
      prompt,
      jsx: parsed.jsx,
      css: parsed.css,
      message: parsed.message,
    });

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to generate component from Gemini' });
  }
};

export const getComponents = async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  try {
    const components = await Component.find({ sessionId }).sort({ createdAt: -1 });
    res.json(components);
  } catch (error) {
    console.error("Error fetching components:", error.message);
    res.status(500).json({ error: "Failed to fetch components" });
  }
};

export const deleteComponent = async (req, res) => {
  const { id } = req.params;
  await Component.findByIdAndDelete(id);
  res.json({ message: 'Component deleted' });
};

export const regenerateComponent = async (req, res) => {
  const { id } = req.params;

  try {
    const existingComponent = await Component.findById(id);
    if (!existingComponent) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const geminiPrompt = `
You are a UI component generator. Given a description, return only 3 fields in JSON:
- "jsx": React component (TSX preferred)
- "css": relevant CSS styles
- "message": short description

Prompt: ${existingComponent.prompt}
`;

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
              parts: [{ text: geminiPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No content returned by Gemini' });
    }

    const cleaned = text.replace(/^```json\n|```$/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON format from Gemini', raw: text });
    }

    // Update the existing component
    existingComponent.jsx = parsed.jsx;
    existingComponent.css = parsed.css;
    existingComponent.message = parsed.message;
    await existingComponent.save();

    res.json(existingComponent);
  } catch (err) {
    console.error('Error in regeneration:', err);
    res.status(500).json({ error: 'Failed to regenerate component' });
  }
};

export const refineComponent = async (req, res) => {
  try {
    const componentId = req.params.id;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: 'Feedback is required' });
    }

    // 1. Find the original component
    const original = await Component.findById(componentId);
    if (!original) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // 2. Combine prompt + feedback
    const combinedPrompt = `Original Prompt: ${original.prompt}\n\nUser Feedback: ${feedback}\n\nRefine the component code accordingly.`;

    // 3. Generate refined code using your LLM
    const { jsx, css, message } = await generateCodeFromLLM(combinedPrompt);

    // 4. Save the refined component (linked to same session)
    const refinedComponent = new Component({
      sessionId: original.sessionId,
      prompt: combinedPrompt,
      jsx,
      css,
      message
    });

    await refinedComponent.save();

    res.status(201).json(refinedComponent);
  } catch (error) {
    console.error('Refinement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const autoSaveComponent = async (req, res) => {
  const { id } = req.params;
  const { jsx, css, message } = req.body;

  if (!jsx && !css && !message) {
    return res.status(400).json({ error: 'At least one field (jsx, css, message) must be provided' });
  }

  try {
    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      { $set: { ...(jsx && { jsx }), ...(css && { css }), ...(message && { message }) } },
      { new: true } // return updated document
    );

    if (!updatedComponent) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.json({ success: true, component: updatedComponent });
  } catch (error) {
    console.error('Auto-save error:', error.message || error);
    res.status(500).json({ error: 'Failed to auto-save component' });
  }
};


