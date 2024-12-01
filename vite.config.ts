import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
      'import.meta.env.VITE_XAI_API_KEY': JSON.stringify(env.VITE_XAI_API_KEY)
    },
    // Explicitly load .env file
    envDir: './',
    // Ensure all env variables are exposed
    envPrefix: 'VITE_'
  };
});
