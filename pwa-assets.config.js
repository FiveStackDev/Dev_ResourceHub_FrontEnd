import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[64, 'favicon.ico']],
    },
    maskable: {
      sizes: [512],
      resizeOptions: {
        background: '#ffffff',
        fit: 'contain',
        position: 'center'
      }
    },
    apple: {
      sizes: [180],
      resizeOptions: {
        background: '#ffffff',
        fit: 'contain',
        position: 'center'
      }
    }
  },
  images: 'public/ResourceHub.png'
});
