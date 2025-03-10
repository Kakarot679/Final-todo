import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import store from './store';
import Login from './pages/Login';
import TodoApp from './pages/TodoApp';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import { useMemo, useState } from 'react';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [open, setOpen] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#4CAF50',
            light: '#81C784',
            dark: '#388E3C',
          },
          secondary: {
            main: '#2196F3',
            dark: '#1976D2',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#F5F5F5',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.125rem',
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                padding: '8px 24px',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiIconButton: {
            defaultProps: {
              'aria-label': 'button',
            },
          },
          MuiLink: {
            defaultProps: {
              underline: 'hover',
            },
          },
          MuiTooltip: {
            defaultProps: {
              arrow: true,
              enterDelay: 400,
            },
          },
        },
      }),
    [mode]
  );

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router 
          future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Box 
                    sx={{ display: 'flex', minHeight: '100vh' }}
                    role="application"
                    aria-label="Todo Application"
                  >
                    <Sidebar 
                      open={open} 
                      onClose={handleDrawerToggle} 
                      toggleColorMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    />
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                      }}
                      role="main"
                    >
                      <Routes>
                        <Route index element={
                          <TodoApp 
                            onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                            onToggleSidebar={handleDrawerToggle}
                            isSidebarOpen={open}
                            view="all"
                          />
                        } />
                        <Route path="today" element={
                          <TodoApp 
                            onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                            onToggleSidebar={handleDrawerToggle}
                            isSidebarOpen={open}
                            view="today"
                          />
                        } />
                        <Route path="important" element={
                          <TodoApp 
                            onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                            onToggleSidebar={handleDrawerToggle}
                            isSidebarOpen={open}
                            view="important"
                          />
                        } />
                        <Route path="planned" element={
                          <TodoApp 
                            onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                            onToggleSidebar={handleDrawerToggle}
                            isSidebarOpen={open}
                            view="planned"
                          />
                        } />
                        <Route path="assigned" element={
                          <TodoApp 
                            onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                            onToggleSidebar={handleDrawerToggle}
                            isSidebarOpen={open}
                            view="assigned"
                          />
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Box>
                  </Box>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
