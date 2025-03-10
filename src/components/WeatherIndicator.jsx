import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherForTask } from '../features/todos/todoSlice';
import {
  Box,
  Chip,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CloudIcon from '@mui/icons-material/Cloud';
import WarningIcon from '@mui/icons-material/Warning';

/**
 * Component to display weather information for outdoor tasks
 * @param {Object} props - Component props
 * @param {string} props.location - Task location
 * @param {boolean} props.isOutdoor - Whether the task is outdoor
 */
const WeatherIndicator = ({ location, isOutdoor }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const weatherData = useSelector((state) => state.todos.weatherData[location]);
  const weatherStatus = useSelector((state) => state.todos.weatherStatus);

  useEffect(() => {
    if (isOutdoor && location && !weatherData) {
      dispatch(fetchWeatherForTask(location));
    }
  }, [dispatch, location, isOutdoor, weatherData]);

  if (!isOutdoor || !location) return null;

  const getWeatherIcon = (weather) => {
    if (!weather) return <CloudIcon />;
    switch (weather.main) {
      case 'Clear':
        return <WbSunnyIcon />;
      case 'Rain':
      case 'Drizzle':
        return <UmbrellaIcon />;
      case 'Thunderstorm':
        return <ThunderstormIcon />;
      case 'Clouds':
        return <CloudIcon />;
      default:
        return <CloudIcon />;
    }
  };

  const getWeatherColor = (weather) => {
    if (!weather) return 'default';
    switch (weather.main) {
      case 'Clear':
        return 'success';
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return 'error';
      case 'Clouds':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getWeatherMessage = (weather) => {
    if (!weather) return 'Weather information unavailable';
    return `${weather.main}: ${weather.description}. Temperature: ${Math.round(weather.temp)}°C`;
  };

  if (weatherStatus === 'loading') {
    return (
      <CircularProgress 
        size={20} 
        sx={{ 
          color: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
          ml: 1 
        }} 
      />
    );
  }

  if (weatherStatus === 'failed') {
    return (
      <Tooltip title="Failed to load weather data">
        <Chip
          icon={<WarningIcon />}
          label="Weather unavailable"
          size="small"
          color="error"
          variant="outlined"
        />
      </Tooltip>
    );
  }

  return weatherData ? (
    <Tooltip title={getWeatherMessage(weatherData.weather[0])}>
      <Chip
        icon={getWeatherIcon(weatherData.weather[0])}
        label={`${Math.round(weatherData.main.temp)}°C`}
        size="small"
        color={getWeatherColor(weatherData.weather[0])}
        variant="outlined"
        sx={{ ml: 1 }}
      />
    </Tooltip>
  ) : null;
};

export default WeatherIndicator; 