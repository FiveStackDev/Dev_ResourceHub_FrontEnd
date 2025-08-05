import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    // Use the ResourceHub.png as the source
    src: 'public/ResourceHub.png',
    // Generate all the recommended icons and images
    resizeOptions: {
      background: '#ffffff'
    }
  },
  images: [
    {
      src: 'public/ResourceHub.png',
      sizes: [192, 512],
      type: 'image/png',
      destination: 'pwa-assets',
    },
    {
      src: 'public/ResourceHub.png',
      sizes: [192, 512],
      type: 'image/png',
      destination: 'pwa-assets',
      purpose: 'maskable',
    }
  ]
});
