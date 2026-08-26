/**
 * Placeholder controller for features planned for future integration.
 */

const { successResponse } = require('../utils/response');
const { NotImplementedError } = require('../utils/errors');

class PlaceholderController {
  
  /**
   * GET /api/weather/:location
   */
  async getWeather(req, res, next) {
    try {
      const location = req.params.location;
      
      // Mock static data
      const weatherData = {
        location,
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: '65%',
        windSpeed: '12 km/h',
        forecast: 'No rain expected in the next 48 hours.',
      };

      return successResponse(res, {
        message: 'Weather data (Placeholder)',
        data: weatherData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schemes
   */
  async getSchemes(req, res, next) {
    try {
      const schemes = [
        {
          id: 1,
          name: 'PM-Kisan Samman Nidhi',
          description: 'Income support of ₹6,000 per year to all landholding farmer families.',
          url: 'https://pmkisan.gov.in/',
        },
        {
          id: 2,
          name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          description: 'Comprehensive crop insurance from pre-sowing to post-harvest losses.',
          url: 'https://pmfby.gov.in/',
        },
        {
          id: 3,
          name: 'Kisan Credit Card (KCC)',
          description: 'Provides farmers with timely access to credit.',
        },
      ];

      return successResponse(res, {
        message: 'Government schemes (Placeholder)',
        data: schemes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * AI Stubs
   */
  async aiDiseaseDetect(req, res, next) {
    next(new NotImplementedError('AI Disease Detection will be integrated in Phase 2.'));
  }

  async aiPricePredict(req, res, next) {
    next(new NotImplementedError('AI Price Prediction will be integrated in Phase 2.'));
  }

  async aiVoiceAssistant(req, res, next) {
    next(new NotImplementedError('Voice Assistant will be integrated in Phase 2.'));
  }

  async aiChatbot(req, res, next) {
    next(new NotImplementedError('AI Chatbot will be integrated in Phase 2.'));
  }
}

module.exports = new PlaceholderController();
