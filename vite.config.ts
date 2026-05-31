import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { nitro } from "nitro/vite"; 

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const root = dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: 'next/navigation',
        replacement: resolve(root, 'src/compat/next-navigation.ts'),
      },
      { find: 'next/link', replacement: resolve(root, 'src/compat/next-link.tsx') },
      {
        find: 'next/dynamic',
        replacement: resolve(root, 'src/compat/next-dynamic.ts'),
      },
      { find: 'next-intl', replacement: resolve(root, 'src/compat/next-intl.ts') },
      {
        find: /^@\/components\/module\//,
        replacement: resolve(root, 'packages/core') + '/',
      },
      { find: /^@\//, replacement: resolve(root, 'src') + '/' },
    ],
  },
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: "bun" }), 
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
