/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6B5FFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        danger: '#DC2626',
        'light-gray': '#F3F4F6',
        'medium-gray': '#D1D5DB',
        'dark-gray': '#6B7280',
        // Tracking colors
        'track-sleep': '#3B82F6',
        'track-water': '#06B6D4',
        'track-meals': '#8B5CF6',
        'track-activity': '#EC4899',
        'track-stress': '#EF4444',
        'track-mood': '#F59E0B',
        'track-symptoms': '#DC2626',
        'track-medicine': '#A855F7',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};

