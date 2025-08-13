//export es para hacerlo disponibe y usable en el package.json

import path from "path"; // nos permite trabajar con rutas de archivos
import fs from "fs"; //nos permite generar la carpeta en caso de no existir
import {glob} from 'glob';
import { src, dest, watch, series } from "gulp"; //funcion que nos permite acceder a archivos y dest es donde se van a almacenar
import * as dartSass from "sass"; //as para nombrar
import gulpSass from "gulp-sass";

const sass = gulpSass(dartSass); //decirle donde va a encontrar la dependencia de sass

import terser from "gulp-terser";
import sharp from "sharp"; //para trabajar con imagenes

export function js(done) {
  src("src/js/app.js")
    .pipe(terser()) //minifica el archivo js
    .pipe(dest("build/js"));

  done();
}

export function css(done) {
  src("src/scss/app.scss", { sourcemaps: true }) //ubica el archivo
    .pipe(
      sass({
        style: "compressed",
      }).on("error", sass.logError)
    ) //aplica sass, pero si hay un error, muestralo
    .pipe(dest("build/css", { sourcemaps: "." })); //ubicar donde se van a almacenar

  done();
}

export async function crop(done) {
  const inputFolder = "src/img/gallery/full";
  const outputFolder = "src/img/gallery/thumb";
  const width = 250;
  const height = 180;
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  const images = fs.readdirSync(inputFolder).filter((file) => {
    return /\.(jpg)$/i.test(path.extname(file));
  });
  try {
    images.forEach((file) => {
      const inputFile = path.join(inputFolder, file);
      const outputFile = path.join(outputFolder, file);
      sharp(inputFile)
        .resize(width, height, {
          position: "centre",
        })
        .toFile(outputFile);
    });

    done();
  } catch (error) {
    console.log(error);
  }
}

export async function imagenes(done) {
  const srcDir = "./src/img";
  const buildDir = "./build/img";
  const images = await glob("./src/img/**/*{jpg,png}");

  images.forEach((file) => {
    const relativePath = path.relative(srcDir, path.dirname(file));
    const outputSubDir = path.join(buildDir, relativePath);
    procesarImagenes(file, outputSubDir);
  });
  done();
}

function procesarImagenes(file, outputSubDir) {
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true });
  }
  const baseName = path.basename(file, path.extname(file));
  const extName = path.extname(file);
  const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
  const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
  const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);

  const options = { quality: 80 };
  sharp(file).jpeg(options).toFile(outputFile);
  sharp(file).webp(options).toFile(outputFileWebp);
  sharp(file).avif().toFile(outputFileAvif);

}

export function dev() {
  watch("src/scss/**/*.scss", css); //archivos que va a estar monitoreando y que funciones se van a ejecutar de esos archivos
  watch("src/js/**/*.js", js);
  watch("src/img/**/*.{png,jpg}", imagenes);
}

export default series(imagenes,crop, js, css, dev);
