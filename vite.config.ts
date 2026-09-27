import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// publicDir is disabled on purpose: the content assets (assets/, project_*/)
// live at the repository root and are consumed via `?url` imports from the
// centralized data file — never copied or duplicated into public/.
export default defineConfig({
  plugins: [react()],
  publicDir: false,
});
