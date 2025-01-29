
import { useState } from 'react';

const GROQ_API_ENDPOINT = 'https://api.groq.com/v1/chat/completions';

export class GroqClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        model: 'mixtral-8x7b-32768',
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export const groq = new GroqClient(process.env.GROQ_API_KEY || '');
