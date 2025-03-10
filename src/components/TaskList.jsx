import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  deleteTaskFromSupabase, 
  toggleTaskInSupabase,
  toggleImportant,
  setReminder,
  assignTask
} from '../features/todos/todoSlice';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
  Modal,
  Backdrop,
  Snackbar,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation } from 'react-router-dom';
import WeatherIndicator from './WeatherIndicator';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const TaskList = ({
  view = 'all',
  searchQuery = '',
  searchResults = [],
  isSearching = false,
  filterOptions = {},
  modalOpen = false,
  onModalClose
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.auth);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignMenuAnchor, setAssignMenuAnchor] = useState(null);
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const handleToggleComplete = async (taskId, currentCompleted) => {
    try {
      await dispatch(toggleTaskInSupabase({ 
        taskId, 
        completed: !currentCompleted 
      })).unwrap();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await dispatch(deleteTaskFromSupabase(taskId)).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleImportant = async (taskId, currentImportant) => {
    try {
      await dispatch(toggleImportant({ 
        taskId, 
        important: !currentImportant 
      })).unwrap();
    } catch (error) {
      console.error('Failed to toggle important:', error);
    }
  };

  const handleSetReminder = (taskId) => {
    setSelectedTask(taskId);
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = async () => {
    if (selectedTask && selectedDate) {
      try {
        await dispatch(setReminder({ 
          taskId: selectedTask, 
          reminderDate: selectedDate.toISOString() 
        })).unwrap();
      } catch (error) {
        console.error('Failed to set reminder:', error);
      }
    }
    setReminderDialogOpen(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await dispatch(assignTask({ taskId, userId })).unwrap();
    } catch (error) {
      setErrorMessage(error || 'Failed to assign task. Please try again.');
    }
    setAssignMenuAnchor(null);
  };

  // Filter tasks based on view and search
  const filteredTasks = useMemo(() => {
    let tasks = isSearching ? searchResults : todos;

    // Apply view filters if not searching
    if (!isSearching) {
      switch (view) {
        case 'today':
          tasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            const today = new Date();
            return taskDate.toDateString() === today.toDateString();
          });
          break;
        case 'important':
          tasks = tasks.filter(task => task.important);
          break;
        case 'planned':
          tasks = tasks.filter(task => task.due_date !== null);
          break;
        case 'assigned':
          tasks = tasks.filter(task => task.assigned_to === user?.id);
          break;
        default:
          break;
      }
    }

    return tasks;
  }, [todos, view, isSearching, searchResults, user?.id]);

  // Separate active and completed tasks
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const renderTaskItem = (task) => (
    <ListItem
      key={task.id}
      sx={{
        borderRadius: 2,
        mb: 1,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <ListItemIcon>
        <Checkbox
          checked={task.completed}
          onChange={() => handleToggleComplete(task.id, task.completed)}
          sx={{ color: 'text.secondary' }}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            {task.important && (
              <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
            )}
            {task.isOutdoor && task.location && (
              <WeatherIndicator 
                location={task.location} 
                isOutdoor={task.isOutdoor} 
              />
            )}
          </Typography>
        }
        secondary={
          <Typography
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 0.5,
              flexWrap: 'wrap',
            }}
          >
            {task.due_date && (
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDate(task.due_date)}
                size="small"
                sx={{ 
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.08)',
                }}
              />
            )}
            {task.location && (
              <Chip
                icon={<LocationOnIcon />}
                label={task.location}
                size="small"
                sx={{ 
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.08)',
                }}
              />
            )}
            {task.assigned_to === user?.id && (
              <Chip
                icon={<PersonIcon />}
                label="Assigned to me"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {task.reminder_date && (
              <Chip
                icon={<NotificationsActiveIcon />}
                label={formatDate(task.reminder_date)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Typography>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={task.reminder_date ? "Edit reminder" : "Set reminder"}>
          <IconButton 
            edge="end" 
            size="small"
            onClick={() => handleSetReminder(task.id)}
            sx={{ 
              color: task.reminder_date ? 'primary.main' : 'text.secondary',
            }}
          >
            {task.reminder_date ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={task.important ? "Remove importance" : "Mark as important"}>
          <IconButton 
            edge="end" 
            size="small"
            onClick={() => handleToggleImportant(task.id, task.important)}
            sx={{ 
              color: task.important ? 'warning.main' : 'text.secondary',
            }}
          >
            {task.important ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Assign task">
          <IconButton 
            edge="end" 
            size="small"
            onClick={(e) => {
              setSelectedTask(task.id);
              setAssignMenuAnchor(e.currentTarget);
            }}
            sx={{ 
              color: task.assigned_to ? 'primary.main' : 'text.secondary',
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton 
            edge="end" 
            size="small"
            onClick={() => handleDelete(task.id)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <>
      {/* Active Tasks */}
      {activeTasks.length > 0 ? (
        <List sx={{ width: '100%' }}>
          {activeTasks.map(renderTaskItem)}
        </List>
      ) : (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            py: 4 
          }}
        >
          {isSearching 
            ? 'No tasks match your search'
            : 'No tasks to display'}
        </Typography>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              mt: 4,
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Completed Tasks
          </Typography>
          <List sx={{ width: '100%' }}>
            {completedTasks.map(renderTaskItem)}
          </List>
        </>
      )}

      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onClose={() => setReminderDialogOpen(false)}>
        <DialogTitle>Set Reminder</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="Reminder Date & Time"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                sx: { mt: 2 },
                fullWidth: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveReminder} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Menu */}
      <Menu
        anchorEl={assignMenuAnchor}
        open={Boolean(assignMenuAnchor)}
        onClose={() => setAssignMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleAssignTask(selectedTask, user.id)}>
          Assign to me
        </MenuItem>
      </Menu>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setErrorMessage('')} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskList; 