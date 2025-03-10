import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../features/auth/authSlice';
import { fetchWeather, addTaskToSupabase, fetchTasks } from '../features/todos/todoSlice';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import WeatherWidget from '../components/WeatherWidget';
import ClearIcon from '@mui/icons-material/Clear';

const TodoApp = ({ onToggleTheme, onToggleSidebar, isSidebarOpen, view }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { weatherData, todos } = useSelector((state) => state.todos);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    showCompleted: true,
    priority: 'all',
  });
  const [sortOption, setSortOption] = useState('dateCreated');
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWeather());
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    // Open task details modal when view changes (except for 'all' view)
    if (view !== 'all') {
      setTaskDetailsOpen(true);
    }
  }, [view]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = todos.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, todos]);

  const getViewTitle = () => {
    switch (view) {
      case 'today':
        return 'Today\'s Tasks';
      case 'important':
        return 'Important Tasks';
      case 'planned':
        return 'Planned Tasks';
      case 'assigned':
        return 'Tasks Assigned to Me';
      default:
        return 'All Tasks';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterChange = (option, value) => {
    setFilterOptions(prev => ({ ...prev, [option]: value }));
    handleFilterClose();
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  const handleAddTask = async (newTask) => {
    try {
      await dispatch(addTaskToSupabase({
        ...newTask,
        created_at: new Date().toISOString(),
      })).unwrap();
    } catch (error) {
      console.error('Failed to add task:', error);
      // You might want to show an error message to the user
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          width: { sm: `calc(100% - ${isSidebarOpen ? 280 : 0}px)` },
          ml: { sm: isSidebarOpen ? `${280}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={onToggleSidebar}
              edge="start"
              sx={{ 
                mr: 2,
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {getViewTitle()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 20,
                bgcolor: 'background.default',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <IconButton sx={{ p: '10px', color: 'text.secondary' }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <IconButton 
                  sx={{ p: '10px' }} 
                  onClick={() => setSearchQuery('')}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Paper>

            <ToggleButtonGroup
              value={view === 'grid' ? 'grid' : 'list'}
              exclusive
              onChange={(event, nextView) => {
                if (nextView !== null) {
                  // Handle view change if needed
                }
              }}
              aria-label="view mode"
              size="small"
              sx={{ 
                mr: 1,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  px: 1,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary' }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={onToggleTheme} sx={{ color: 'text.secondary' }}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#F5F5F5',
          p: 3,
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <TaskInput onAddTask={handleAddTask} />
          
          {/* Tasks Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              mt: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
              {isSearching ? `Search Results for "${searchQuery}"` : getViewTitle()}
            </Typography>
            <TaskList 
              view={view}
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              filterOptions={filterOptions}
              modalOpen={taskDetailsOpen}
              onModalClose={() => setTaskDetailsOpen(false)}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default TodoApp; 