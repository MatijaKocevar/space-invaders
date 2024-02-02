import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import mkcert from 'vite-plugin-mkcert';

export default () => {
    return defineConfig({
        base: '/space-invaders/',
        plugins: [eslintPlugin(), mkcert()],
        server: {
            host: true,
            cors: true,
        },
    });
};
