import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Chip,
  Box,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toggleTodo, deleteTodo } from '../features/todos/todoSlice';

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskItem = ({ task, view }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteTodo(task.id));
    handleMenuClose();
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    handleMenuClose();
  };

  const handleToggle = () => {
    dispatch(toggleTodo(task.id));
  };

  const menu = (
    <>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'task-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="task-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );

  if (view === 'list') {
    return (
      <ListItem
        sx={{
          borderRadius: 1,
          mb: 1,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.02)',
          },
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={task.completed}
            onChange={handleToggle}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {task.description}
                </Typography>
              )}
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority)}
                sx={{ mr: 1 }}
              />
              {task.dueDate && (
                <Chip
                  label={new Date(task.dueDate).toLocaleDateString()}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          }
        />
        {menu}
      </ListItem>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggle}
            sx={{ mt: -0.5, ml: -1 }}
          />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            {task.title}
          </Typography>
        </Box>
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {task.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={task.priority}
            size="small"
            color={getPriorityColor(task.priority)}
          />
          {task.dueDate && (
            <Chip
              label={new Date(task.dueDate).toLocaleDateString()}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        {menu}
      </CardActions>
    </Card>
  );
};

export default TaskItem; 