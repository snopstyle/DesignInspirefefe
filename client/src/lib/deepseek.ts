
export async function askDeepSeek(message: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from DeepSeek');
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error calling DeepSeek:', error);
    throw error;
  }
}
