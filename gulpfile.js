//export es para hacerlo disponibe y usable en el package.json

import {src,dest,watch, series} from 'gulp'; //funcion que nos permite acceder a archivos y dest es donde se van a almacenar
import * as dartSass from 'sass'; //as para nombrar
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass); //decirle donde va a encontrar la dependencia de sass

export function js(done){
    src('src/js/app.js')
    .pipe(dest('build/js'))

    done()
}

export function css(done){
   src('src/scss/app.scss', {sourcemaps:true})//ubica el archivo
    .pipe(sass().on('error', sass.logError))//aplica sass, pero si hay un error, muestralo
    .pipe(dest('build/css', {sourcemaps:'.'}))//ubicar donde se van a almacenar
    
    done();

}
export function dev(){
    watch('src/scss/**/*.scss', css)//archivos que va a estar monitoreando y que funciones se van a ejecutar de esos archivos
    watch('src/js/**/*.js', js)
}

export default series(js,css,dev)