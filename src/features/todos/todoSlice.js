import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { supabase } from '../../supabase/client';
import WeatherService from '../../services/WeatherService';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Fetch tasks from Supabase
export const fetchTasks = createAsyncThunk(
  'todos/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new task to Supabase
export const addTaskToSupabase = createAsyncThunk(
  'todos/addTask',
  async (task, { rejectWithValue }) => {
    try {
      // Transform the task object to match database schema
      const taskData = {
        title: task.title,
        due_date: task.due_date,
        created_at: new Date().toISOString(),
        important: false,
        reminder_date: null,
        assigned_to: null,
        completed: false,
        is_outdoor: task.isOutdoor || false,
        location: task.location || null
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      
      // If it's an outdoor task with location, fetch weather immediately
      if (data.is_outdoor && data.location) {
        const weatherData = await WeatherService.getWeather(data.location);
        return { ...data, weatherData };
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a task from Supabase
export const deleteTaskFromSupabase = createAsyncThunk(
  'todos/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle task completion in Supabase
export const toggleTaskInSupabase = createAsyncThunk(
  'todos/toggleTask',
  async ({ taskId, completed }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeather = createAsyncThunk(
  'todos/fetchWeather',
  async (_, { rejectWithValue }) => {
    try {
      // Get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Set reminder
export const setReminder = createAsyncThunk(
  'todos/setReminder',
  async ({ taskId, reminderDate }) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ reminder_date: reminderDate })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

// Toggle important
export const toggleImportant = createAsyncThunk(
  'todos/toggleImportant',
  async ({ taskId, important }) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ important })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

// Assign task
export const assignTask = createAsyncThunk(
  'todos/assignTask',
  async ({ taskId, userId }, { rejectWithValue }) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No active session found. Please log in.');

      const { data, error } = await supabase
        .from('tasks')
        .update({ assigned_to: session.user.id })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherForTask = createAsyncThunk(
  'todos/fetchWeatherForTask',
  async (location) => {
    const weatherData = await WeatherService.getWeather(location);
    return weatherData;
  }
);

export const fetchOutdoorForecast = createAsyncThunk(
  'todos/fetchOutdoorForecast',
  async ({ lat, lon }) => {
    const forecastData = await WeatherService.getOutdoorForecast(lat, lon);
    return forecastData;
  }
);

const initialState = {
  todos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  weatherData: {},
  outdoorForecast: null,
  weatherStatus: 'idle',
  weatherError: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Task
      .addCase(addTaskToSupabase.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })
      // Delete Task
      .addCase(deleteTaskFromSupabase.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      // Toggle Task
      .addCase(toggleTaskInSupabase.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      // Weather
      .addCase(fetchWeather.pending, (state) => {
        state.weatherStatus = 'loading';
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weatherStatus = 'succeeded';
        state.weatherData = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.weatherStatus = 'failed';
        state.weatherError = action.payload;
      })
      .addCase(setReminder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setReminder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(setReminder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleImportant.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(fetchWeatherForTask.pending, (state) => {
        state.weatherStatus = 'loading';
      })
      .addCase(fetchWeatherForTask.fulfilled, (state, action) => {
        state.weatherStatus = 'succeeded';
        state.weatherData[action.meta.arg] = action.payload;
        state.weatherError = null;
      })
      .addCase(fetchWeatherForTask.rejected, (state, action) => {
        state.weatherStatus = 'failed';
        state.weatherError = action.error.message;
      })
      .addCase(fetchOutdoorForecast.fulfilled, (state, action) => {
        state.outdoorForecast = action.payload;
      });
  },
});

export default todoSlice.reducer; 