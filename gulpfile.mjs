import browserSync from 'browser-sync';
import { deleteSync } from 'del';
import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import dartSass from 'sass';
import named from 'vinyl-named';
import webpackStream from 'webpack-stream';

const bs = browserSync.create();
const sass = gulpSass(dartSass);

const paths = {
  pug: {
    pages: 'src/pages/**/!(_)*.pug',
    index: 'src/pages/index.pug',
  },
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  files: 'src/files/**/*',
  dist: {
    base: 'dist',
    html: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    files: 'dist/files',
  },
};

// Очистка dist
export function clean(done) {
  deleteSync([paths.dist.base]);
  done();
}

// Копирование статических файлов
export function copyFiles() {
  return gulp.src(paths.files)
    .pipe(gulp.dest(paths.dist.files));
}

// Сборка SCSS
export function styles() {
  return gulp.src(paths.scss)
    .pipe(plumber(function(error) {
      console.error('Styles error:', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(bs.stream({match: '**/*.css'}));
}

// Сборка Pug страниц
export function pages() {
  return gulp.src(paths.pug.pages)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(rename(filePath => { filePath.dirname = ''; }))
    .pipe(gulp.dest(paths.dist.html));
}

// Сборка index.pug
export function indexPage() {
  return gulp.src(paths.pug.index)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.dist.html));
}

// Сборка JS
export function scripts() {
  return gulp.src(paths.js)
    .pipe(plumber(function(error) {
      console.error('JS error:', error.message);
      this.emit('end');
    }))
    .pipe(named())
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.mjs', '.json'],
        enforceExtension: false
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(bs.stream({match: '**/*.js'}));
}

// Сервер и автооткрытие браузера
export function serve() {
  bs.init({
    server: {
      baseDir: paths.dist.base
    },
    port: 3000,
    open: true,
    notify: false
  });
  return Promise.resolve();
}

// Вотчеры (обновлённая версия)
export function watch() {
  // Вотчер для стилей
  const stylesWatcher = gulp.watch(['src/**/*.scss', '!src/**/_*.scss'], styles);
  stylesWatcher.on('change', (path) => {
    console.log('SCSS changed:', path);
  });

  // Вотчер для JS
  const jsWatcher = gulp.watch(['src/**/*.js', '!src/**/_*.js'], scripts);
  jsWatcher.on('change', (path) => {
    console.log('JS changed:', path);
  });

  // Вотчер для Pug
  const pugWatcher = gulp.watch(
    ['src/**/*.pug', '!src/**/_*.pug'],
    gulp.series(pages, indexPage, reloadBrowser)
  );

  const filesWatcher = gulp.watch(paths.files, copyFiles);
  filesWatcher.on('change', (path) => {
    console.log('Asset changed:', path);
    bs.reload();
  });

  // Общая обработка ошибок
  const handleError = (err, watcher) => {
    console.error('Watch error:', err);
    watcher.end();
    setTimeout(() => watch(), 1000);
  };

  stylesWatcher.on('error', (err) => handleError(err, stylesWatcher));
  jsWatcher.on('error', (err) => handleError(err, jsWatcher));
  pugWatcher.on('error', (err) => handleError(err, pugWatcher));
  filesWatcher.on('error', (err) => handleError(err, filesWatcher));
}

// Отдельная задача для перезагрузки браузера
function reloadBrowser(done) {
  bs.reload();
  done();
}

// Сборка
const build = gulp.series(clean, gulp.parallel(styles, scripts, pages, indexPage, copyFiles));

// Экспорты
export { build };
export default gulp.series(build, serve, watch);
