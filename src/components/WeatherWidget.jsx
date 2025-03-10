import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
} from '@mui/material';
import { useSelector } from 'react-redux';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const WeatherWidget = () => {
  const theme = useTheme();
  const { weatherData, weatherLoading, weatherError } = useSelector((state) => state.todos);

  if (weatherLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (weatherError) {
    return (
      <Box display="flex" alignItems="center" p={2}>
        <Typography color="error" variant="body2">
          {weatherError}
        </Typography>
      </Box>
    );
  }

  if (!weatherData) {
    return null;
  }

  const getWeatherIcon = (weatherId) => {
    if (weatherId < 300) return <ThunderstormIcon />;
    if (weatherId < 600) return <CloudIcon />;
    return <WbSunnyIcon />;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      flexWrap: 'wrap',
      gap: 3,
      p: 1,
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
      }}>
        <LocationOnIcon color="primary" />
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
          }}
        >
          {weatherData.name}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        flexGrow: 1,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          p: 1,
        }}>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            style={{ 
              width: 50, 
              height: 50,
              filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none',
            }}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              ml: 1,
              fontWeight: 500,
              color: theme.palette.mode === 'dark' 
                ? 'primary.light' 
                : 'primary.main',
            }}
          >
            {Math.round(weatherData.main.temp)}°C
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.7)' 
              : 'text.secondary',
            textTransform: 'capitalize',
          }}
        >
          {weatherData.weather[0].description}
        </Typography>
      </Box>
    </Box>
  );
};

export default WeatherWidget; 