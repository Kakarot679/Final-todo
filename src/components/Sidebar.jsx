import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  useTheme,
  IconButton,
  useMediaQuery,
  Tooltip,
  Badge,
  Paper,
  SvgIcon,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setReminder } from '../features/todos/todoSlice';
import image from '../assets/image.png'; // Updated path assuming image is in assets folder
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskList from './TaskList';

// Custom Star Icon component
const CustomStarIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
  </SvgIcon>
);

const drawerWidth = 280;

const Sidebar = ({ open, onClose, toggleColorMode }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { todos } = useSelector((state) => state.todos);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('all');

  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Generate a unique avatar URL based on the user's name or email
  const getAvatarUrl = (identifier) => {
    // Use the 'avataaars' style from Dicebear
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(identifier)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const handleSetReminder = (taskId) => {
    setSelectedTask(taskId);
    setReminderDialogOpen(true);
  };

  const handleSaveReminder = () => {
    if (selectedTask && selectedDate) {
      dispatch(setReminder({ taskId: selectedTask, reminderDate: selectedDate.toISOString() }));
    }
    setReminderDialogOpen(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  const getTodaysTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todos.filter(task => {
      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  };

  const getImportantTasks = () => {
    return todos.filter(task => task.important);
  };

  const getPlannedTasks = () => {
    return todos.filter(task => task.due_date);
  };

  const getAssignedTasks = () => {
    return todos.filter(task => task.assigned_to === user?.id);
  };

  const menuItems = [
    { 
      text: 'All Tasks', 
      icon: <DashboardIcon />, 
      path: '/',
      count: todos.length 
    },
    { 
      text: 'Today', 
      icon: <TodayIcon />, 
      path: '/today', 
      highlight: true,
      count: getTodaysTasks().length 
    },
    { 
      text: 'Important', 
      icon: <CustomStarIcon />, 
      path: '/important',
      count: getImportantTasks().length 
    },
    { 
      text: 'Planned', 
      icon: <EventIcon />, 
      path: '/planned',
      count: getPlannedTasks().length 
    },
    { 
      text: 'Assigned to me', 
      icon: <PersonIcon />, 
      path: '/assigned',
      count: getAssignedTasks().length 
    },
  ];

  const ProfileSection = () => (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#F5F5F5',
      }}
    >
      <Box sx={{ position: 'relative', width: 100, height: 100 }}>
        <Avatar
          src={getAvatarUrl(user?.email || 'default')}
          sx={{
            width: '100%',
            height: '100%',
            border: 3,
            borderColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            bgcolor: theme.palette.primary.main,
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
        {user?.name || 'Guest User'}
      </Typography>
    </Box>
  );

  const handleMenuItemClick = (path, viewType) => {
    if (viewType === 'important' || viewType === 'planned' || viewType === 'assigned') {
      setSelectedView(viewType);
      setModalOpen(true);
    } else {
      navigate(path);
    }
    if (isMobile) onClose();
  };

  const MainMenuSection = () => (
    <List sx={{ px: 2, py: 2 }}>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          button
          selected={location.pathname === item.path}
          onClick={() => handleMenuItemClick(item.path, item.path.replace('/', '') || 'all')}
          sx={{
            borderRadius: 2,
            mb: 1,
            color: item.highlight ? 'primary.main' : 'text.primary',
            '&.Mui-selected': {
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(76, 175, 80, 0.15)'
                : 'rgba(76, 175, 80, 0.1)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(76, 175, 80, 0.25)'
                  : 'rgba(76, 175, 80, 0.2)',
              },
            },
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              color: item.highlight ? 'primary.main' : 
                location.pathname === item.path ? 'primary.main' : 'text.secondary',
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: item.highlight || location.pathname === item.path ? 500 : 400,
              },
            }}
          />
          {item.count > 0 && (
            <Badge 
              badgeContent={item.count} 
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </ListItem>
      ))}
    </List>
  );

  const AddListSection = () => (
    <List sx={{ 
      px: 2, 
      py: 1,
      borderTop: 1,
      borderColor: 'divider',
      mt: 'auto' // Push to bottom
    }}>
      <ListItem
        button
        sx={{
          borderRadius: 2,
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
          <AddIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Add List"
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: 400,
            },
          }}
        />
      </ListItem>
    </List>
  );

  const ProgressSection = () => (
    <Box 
      sx={{ 
        px: 2,
        py: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={completionPercentage}
            size={80}
            thickness={6}
            sx={{
              color: theme.palette.primary.main,
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" color="text.primary" sx={{ fontWeight: 600 }}>
              {Math.round(completionPercentage)}%
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProfileSection />
      <MainMenuSection />
      <Box sx={{ flexGrow: 1 }} />
      <AddListSection />
      <ProgressSection />
    </Box>
  );

  return (
    <>
      {/* Main header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          height: 64,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 2,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <IconButton
          color="inherit"
          onClick={onClose}
          edge="start"
          sx={{ 
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        <img 
          src={image} 
          alt="Logo" 
          style={{ 
            height: 30,
          }} 
        />
        <Box sx={{ flexGrow: 1 }} />
        {searchOpen ? (
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 200,
              px: 2,
              py: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 20,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={{ color: 'text.primary' }}
              autoFocus
              onBlur={() => {
                if (!searchQuery) {
                  setSearchOpen(false);
                }
              }}
            />
          </Paper>
        ) : (
          <IconButton 
            color="inherit" 
            onClick={() => setSearchOpen(true)}
            sx={{ 
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <SearchIcon />
          </IconButton>
        )}
        <IconButton 
          color="inherit"
          onClick={toggleColorMode}
          sx={{ 
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#F5F5F5',
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',  // Firefox
              msOverflowStyle: 'none',  // IE and Edge
              overflowY: 'scroll',
              marginTop: '64px', // Add space for the header
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onClose={() => setReminderDialogOpen(false)}>
        <DialogTitle>Set Reminder</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="Reminder Date & Time"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveReminder} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Details Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={{
            width: { xs: '90%', sm: 600 },
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
            position: 'relative',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {selectedView === 'important' && <StarIcon sx={{ color: 'warning.main', mr: 1 }} />}
              {selectedView === 'planned' && <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />}
              {selectedView === 'assigned' && <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />}
              <Typography variant="h6" component="h2">
                {selectedView === 'important' && 'Important Tasks'}
                {selectedView === 'planned' && 'Planned Tasks'}
                {selectedView === 'assigned' && 'Tasks Assigned to Me'}
              </Typography>
            </Box>
            
            <TaskList 
              view={selectedView}
              modalOpen={modalOpen}
              onModalClose={() => setModalOpen(false)}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Sidebar; 