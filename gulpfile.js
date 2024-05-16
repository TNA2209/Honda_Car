const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

// Đường dẫn các thư mục nguồn và đích
const paths = {
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  // images: {
  //   src: "src/img/**/*",
  //   dest: "dist/img/",
  // },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
};

// Task HTML
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Task Styles
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}
// function images() {
//   return gulp
//     .src(paths.images.src)
//     .pipe(gulp.dest(paths.images.dest))
//     .pipe(browserSync.stream());  
// }
// Task Scripts
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Task Watch
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  // gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

// Định nghĩa các task
const build = gulp.series(gulp.parallel(html, styles, scripts), watch);

// Xuất các task để có thể chạy bằng dòng lệnh
exports.html = html;
exports.styles = styles;
// exports.images = images;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
