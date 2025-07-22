//export es para hacerlo disponibe y usable en el package.json

import {src,dest,watch} from 'gulp'; //funcion que nos permite acceder a archivos y dest es donde se van a almacenar
import * as dartSass from 'sass'; //as para nombrar
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass); //decirle donde va a encontrar la dependencia de sass

export function css(done){
   src('src/scss/app.scss')//ubica el archivo
    .pipe(sass().on('error', sass.logError))//aplica sass, pero si hay un error, muestralo
    .pipe(dest('build/css'))//ubicar donde se van a almacenar
    
    done();

}
export function dev(){
    watch('src/scss/**/*.scss', css)//archivos que va a estar monitoreando y que funciones se van a ejecutar de esos archivos

}