import axios from 'axios';

export const generateAIImage = async (prompt) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: '512x512'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const imageUrl = response.data.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};