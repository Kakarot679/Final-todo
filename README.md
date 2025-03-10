# Advanced Todo Application with Weather Integration

A modern, feature-rich todo application built with React, Material-UI, and OpenWeatherMap API integration. This application helps users manage tasks while providing weather information for outdoor activities.

## Features

- ✨ Modern, responsive Material-UI design
- 🌤️ Weather integration for outdoor tasks
- 📅 Due date scheduling with calendar picker
- 📍 Location-based weather information
- ✅ Task completion tracking
- 🔔 Task reminders
- 👥 Task assignment capabilities
- 🌙 Dark/Light mode support

## Live Demo

https://final-todo-hrnegxz5m-hardiks-projects-9ec662da.vercel.app/


## Screenshots

![Task Creation](screenshots/Screenshot%202025-03-10%20103324.png)  
![Weather Integration](screenshots/Screenshot%202025-03-10%20103348.png)  
![Task Management](screenshots/Screenshot%202025-03-10%20103741.png)  
![Additional Screenshot](screenshots/Screenshot%202025-03-10%20103801.png)  


## Tech Stack

- React
- Redux Toolkit
- Material-UI (MUI)
- Vite
- Supabase
- OpenWeatherMap API
- Date-fns

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/react-todo-advanced.git
   cd react-todo-advanced
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Database Setup

1. Create a new project in Supabase
2. Run the following SQL to create the necessary tables:
   ```sql
   CREATE TABLE tasks (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     completed BOOLEAN DEFAULT false,
     due_date TIMESTAMP WITH TIME ZONE,
     reminder_date TIMESTAMP WITH TIME ZONE,
     important BOOLEAN DEFAULT false,
     assigned_to UUID REFERENCES auth.users(id),
     is_outdoor BOOLEAN DEFAULT false,
     location TEXT
   );
   ```

## Deployment

This application is deployed using [Vercel/Netlify/GitHub Pages]. To deploy your own instance:

1. Fork this repository
2. Connect your fork to your preferred deployment platform
3. Set up the environment variables in your deployment platform
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
