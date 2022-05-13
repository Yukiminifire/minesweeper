import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

import nested from 'postcss-nested'
import { Plugin } from 'postcss'

import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [WindiCSS(), vue(), jsx()],
  css: {
    postcss: {
      plugins: [nested as unknown as Plugin],
    },
  },
})
