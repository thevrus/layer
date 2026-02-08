import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }),
  manifest: {
    name: 'Layer',
    description: 'Add your own CSS and JavaScript to any website',
    permissions: ['storage', 'scripting', 'activeTab', 'tabs'],
    host_permissions: ['<all_urls>'],
  },
});
