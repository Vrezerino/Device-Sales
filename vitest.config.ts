import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        include: ['**/*.test.tsx'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['__tests__/setup.tsx', 'dotenv/config']
    },
})