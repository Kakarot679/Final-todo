import { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const TaskInput = ({ onAddTask }) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [location, setLocation] = useState('');
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        due_date: dueDate,
        isOutdoor: isOutdoor,
        location: isOutdoor ? location.trim() || null : null
      });
      setTitle('');
      setDueDate(null);
      setIsOutdoor(false);
      setLocation('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOpenDatePicker = () => {
    setTempDate(dueDate);
    setDateDialogOpen(true);
  };

  const handleCloseDatePicker = () => {
    setDateDialogOpen(false);
    setTempDate(null);
  };

  const handleSaveDate = () => {
    setDueDate(tempDate);
    setDateDialogOpen(false);
  };

  const handleOpenLocation = () => {
    setLocationDialogOpen(true);
  };

  const handleSaveLocation = () => {
    setLocationDialogOpen(false);
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onClick={() => !isExpanded && setIsExpanded(true)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#F0F7F0',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: !isExpanded ? 'pointer' : 'default',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 0 0 1px rgba(76, 175, 80, 0.3)'
            : '0 0 0 1px rgba(76, 175, 80, 0.2)',
        },
      }}
    >
      <InputBase
        placeholder="Add a task..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!isExpanded) setIsExpanded(true);
        }}
        onKeyPress={handleKeyPress}
        multiline
        fullWidth
        aria-label="Task title"
        sx={{ color: 'text.primary' }}
      />

      {isExpanded && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mt: 1 
          }}
          role="toolbar"
          aria-label="Task options"
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Set due date">
              <IconButton
                size="small"
                onClick={handleOpenDatePicker}
                aria-label="Set due date"
                sx={{ color: dueDate ? 'primary.main' : 'text.secondary' }}
              >
                <CalendarTodayIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isOutdoor ? "Outdoor activity" : "Mark as outdoor activity"}>
              <IconButton
                size="small"
                onClick={() => setIsOutdoor(!isOutdoor)}
                aria-label={isOutdoor ? "Outdoor activity" : "Mark as outdoor activity"}
                aria-pressed={isOutdoor}
                sx={{ 
                  color: isOutdoor ? 'primary.main' : 'text.secondary',
                  bgcolor: isOutdoor ? 'primary.light' : 'transparent',
                  '&:hover': {
                    bgcolor: isOutdoor ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                <WbSunnyIcon />
              </IconButton>
            </Tooltip>

            {isOutdoor && (
              <Tooltip title="Set location">
                <IconButton
                  size="small"
                  onClick={handleOpenLocation}
                  aria-label="Set location"
                  sx={{ 
                    color: location ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            type="submit"
            sx={{ 
              px: 3,
              borderRadius: 20,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            Add Task
          </Button>
        </Box>
      )}

      <Dialog 
        open={dateDialogOpen} 
        onClose={handleCloseDatePicker}
        aria-labelledby="date-dialog-title"
      >
        <DialogTitle id="date-dialog-title">Set Due Date</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={tempDate}
              onChange={(newValue) => setTempDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  'aria-label': 'Due date'
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDatePicker}>Cancel</Button>
          <Button onClick={handleSaveDate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={locationDialogOpen} 
        onClose={() => setLocationDialogOpen(false)}
        aria-labelledby="location-dialog-title"
      >
        <DialogTitle id="location-dialog-title">Set Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
            helperText="Enter the city name for weather information"
            aria-label="Location input"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveLocation}
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskInput; 