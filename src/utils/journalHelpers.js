export const getWordCount = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = getWordCount(text);
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};


export const generateJournalPrompts = (sign, mood) => {
  const prompts = [
    `How did today's horoscope resonate with your ${sign} energy?`,
    `What emotions are you feeling right now, and why?`,
    `Describe three things you're grateful for today.`,
    `What challenged you today, and how did you overcome it?`,
    `What would you like to manifest tomorrow?`,
    `How are you honoring your ${sign} traits today?`,
    `What insights did you gain about yourself today?`,
    `Describe a moment that made you smile today.`,
    `What are you looking forward to?`,
    `How did you practice self-care today?`,
  ];
  
  return prompts.sort(() => 0.5 - Math.random()).slice(0, 3);
};