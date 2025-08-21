const BASE_URL = 'https://aztro.sameerkumar.website';
const TIMEOUT = 10000;

export const fetchHoroscoprFromAPI = async (sign , day = 'today') => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(),TIMEOUT);

    try {
    const response = await fetch(`${BASE_URL}?sign=${sign}&day=${day}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    console.error('API Error:', error);
    throw error;
  }
};
