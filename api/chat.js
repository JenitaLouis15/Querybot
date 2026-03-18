import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function sendMessage(messages) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message;
  } catch (err) {
    console.error('Groq API Error:', err);
    return { role: 'assistant', content: 'Something went wrong. Please try again.' };
  }
}