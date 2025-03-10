const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Service class for handling weather-related API calls
 */
class WeatherService {
  /**
   * Get weather data for a specific location
   * @param {string} location - City name or coordinates
   * @returns {Promise} Weather data
   */
  static async getWeather(location) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`
      );
      if (!response.ok) throw new Error('Weather data fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  /**
   * Get weather forecast for outdoor activities
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise} Forecast data
   */
  static async getOutdoorForecast(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      if (!response.ok) throw new Error('Forecast data fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  /**
   * Check if weather is suitable for outdoor activity
   * @param {Object} weather - Weather data
   * @returns {boolean} True if weather is suitable
   */
  static isWeatherSuitableForOutdoor(weather) {
    if (!weather) return false;
    
    const unsuitable_conditions = [
      'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Tornado'
    ];
    
    return !unsuitable_conditions.includes(weather.main);
  }
}

export default WeatherService; 