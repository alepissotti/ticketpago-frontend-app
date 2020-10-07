import {Injectable, Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the BuscadorTituloEspectaculoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'buscadorTituloEspectaculo',
})
@Injectable()
export class BuscadorTituloEspectaculoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(espectaculos: any[], nombre: any) : any {

    if (!espectaculos || !nombre) {
      return espectaculos;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return espectaculos.filter(function(item) {
      return item.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1 });
  }
}
