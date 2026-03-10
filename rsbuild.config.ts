import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

const { publicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        exportType: 'default',
      },
    })
  ],
  html: {
    template: './public/index.html',
  },
  source: {
    define: publicVars,
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
  performance: {
    chunkSplit: {
      strategy: "single-vendor"
    }
  }
});
