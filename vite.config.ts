import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default () => {
    return defineConfig({
        base: '/space-invaders/',
        plugins: [eslintPlugin()],
    });
};
