import copy from 'rollup-plugin-copy';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;
const port = 8080;

export default {
  input: './src/scripts/_rslider.ts',
  output: [
    {
      file: './dist/js/rslider.js',
      format: 'iife',
      name: 'RSlider',
      globals: { jquery: '$' },
    },
    {
      file: './dist/js/rslider.min.js',
      format: 'iife',
      name: 'RSlider',
      plugins: [terser()],
      globals: { jquery: '$' },
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: './node_modules/jquery/dist/jquery.min.js', dest: './dist/js/' },
        { src: './src/demo/*.css', dest: './dist/css/' },
        { src: './src/demo/*.js', dest: './dist/js/' },
        { src: './src/demo/*.html', dest: './dist/' },
      ],
    }),
    sass({
      output: './dist/css/rslider.css',
    }),
    typescript(),
    !production &&
      serve({
        open: true,
        contentBase: 'dist/',
        openPage: '/demo.html',
        historyApiFallback: true,
        port,
      }),
    !production && livereload({ watch: 'dist' }),
  ],
  external: ['jquery'],
};
