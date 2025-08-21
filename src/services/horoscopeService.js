import {fetchHoroscopeFromAPI} from './api';

const MOCK_HOROSCOPES = {
  aries: {
    horoscope: "Today brings new opportunities your way, Aries. Your natural leadership qualities will shine brightly, and others will look to you for guidance and inspiration. Trust your instincts and take bold action toward your goals. The stars favor courage and initiative today.",
    sign: "Aries",
    date: new Date().toISOString().split('T')[0],
    mood: "Confident",
    color: "#FF6B6B",
    luckyNumber: 7,
    compatibility: "Leo, Sagittarius",
  },
  taurus: {
    horoscope: "Focus on building stability in your life today, Taurus. Your patience and determination will pay off handsomely. Take time to appreciate the beauty around you and enjoy life's simple pleasures. A financial opportunity may present itself.",
    sign: "Taurus",
    date: new Date().toISOString().split('T')[0],
    mood: "Grounded",
    color: "#4ECDC4",
    luckyNumber: 2,
    compatibility: "Virgo, Capricorn",
  },
  gemini: {
    horoscope: "Communication is your superpower today, Gemini. Your quick wit and adaptability will help you navigate various situations with ease. Connect with friends, share your innovative ideas, and embrace new learning opportunities that come your way.",
    sign: "Gemini",
    date: new Date().toISOString().split('T')[0],
    mood: "Curious",
    color: "#45B7D1",
    luckyNumber: 3,
    compatibility: "Libra, Aquarius",
  },
  cancer: {
    horoscope: "Trust your intuition today, Cancer. Your empathetic nature will help you understand others' needs deeply. Focus on family and home, creating a nurturing environment. Your emotional intelligence is your greatest asset right now.",
    sign: "Cancer",
    date: new Date().toISOString().split('T')[0],
    mood: "Nurturing",
    color: "#96CEB4",
    luckyNumber: 4,
    compatibility: "Scorpio, Pisces",
  },
  leo: {
    horoscope: "Your confidence and creativity are at their peak today, Leo. Don't be afraid to take center stage and share your talents with the world. Recognition and appreciation are coming your way. Let your inner light shine brilliantly.",
    sign: "Leo",
    date: new Date().toISOString().split('T')[0],
    mood: "Radiant",
    color: "#FECA57",
    luckyNumber: 1,
    compatibility: "Aries, Sagittarius",
  },
  virgo: {
    horoscope: "Attention to detail serves you exceptionally well today, Virgo. Your analytical mind will help solve complex problems that have been puzzling others. Focus on organization and practical matters. Perfection is within reach.",
    sign: "Virgo",
    date: new Date().toISOString().split('T')[0],
    mood: "Methodical",
    color: "#A8E6CF",
    luckyNumber: 6,
    compatibility: "Taurus, Capricorn",
  },
  libra: {
    horoscope: "Balance and harmony are your guiding themes today, Libra. Your diplomatic skills will help resolve conflicts elegantly. Focus on relationships and creating beautiful surroundings. Justice and fairness will prevail in your endeavors.",
    sign: "Libra",
    date: new Date().toISOString().split('T')[0],
    mood: "Harmonious",
    color: "#DDA0DD",
    luckyNumber: 9,
    compatibility: "Gemini, Aquarius",
  },
  scorpio: {
    horoscope: "Your intensity and passion drive you forward today, Scorpio. Trust your deeper instincts and don't be afraid to transform aspects of your life that no longer serve you. Powerful insights and revelations await.",
    sign: "Scorpio",
    date: new Date().toISOString().split('T')[0],
    mood: "Intense",
    color: "#8B4C8B",
    luckyNumber: 8,
    compatibility: "Cancer, Pisces",
  },
  sagittarius: {
    horoscope: "Adventure calls to you today, Sagittarius. Your optimistic outlook opens new doors and possibilities. Consider expanding your horizons through travel, education, or spiritual pursuits. The world is your classroom.",
    sign: "Sagittarius",
    date: new Date().toISOString().split('T')[0],
    mood: "Adventurous",
    color: "#FFB347",
    luckyNumber: 5,
    compatibility: "Aries, Leo",
  },
  capricorn: {
    horoscope: "Your discipline and ambition are your greatest assets today, Capricorn. Focus on long-term goals and building lasting success. Hard work and persistence will soon pay off spectacularly. Leadership opportunities emerge.",
    sign: "Capricorn",
    date: new Date().toISOString().split('T')[0],
    mood: "Ambitious",
    color: "#708090",
    luckyNumber: 10,
    compatibility: "Taurus, Virgo",
  },
  aquarius: {
    horoscope: "Innovation and originality set you apart today, Aquarius. Your unique perspective brings fresh solutions to old problems. Connect with like-minded individuals who share your vision for a better future.",
    sign: "Aquarius",
    date: new Date().toISOString().split('T')[0],
    mood: "Revolutionary",
    color: "#87CEEB",
    luckyNumber: 11,
    compatibility: "Gemini, Libra",
  },
  pisces: {
    horoscope: "Your imagination and compassion guide you today, Pisces. Trust your dreams and intuitive insights—they hold important messages. Creative pursuits will bring joy and fulfillment. Your spiritual connection is particularly strong.",
    sign: "Pisces",
    date: new Date().toISOString().split('T')[0],
    mood: "Dreamy",
    color: "#DDA0DD",
    luckyNumber: 12,
    compatibility: "Cancer, Scorpio",
  },
};

export const getHoroscope = async (sign, day = 'today') => {
  try {
    const data = await fetchHoroscopeFromAPI(sign, day);
    return {
      ...data,
      mood: MOCK_HOROSCOPES[sign.toLowerCase()]?.mood || 'Positive',
      color: MOCK_HOROSCOPES[sign.toLowerCase()]?.color || '#6366f1',
      luckyNumber: MOCK_HOROSCOPES[sign.toLowerCase()]?.luckyNumber || Math.floor(Math.random() * 12) + 1,
      compatibility: MOCK_HOROSCOPES[sign.toLowerCase()]?.compatibility || 'All signs',
    };
  } catch (error) {
    console.log('Using fallback horoscope data');
    return MOCK_HOROSCOPES[sign.toLowerCase()] || MOCK_HOROSCOPES.aries;
  }
};