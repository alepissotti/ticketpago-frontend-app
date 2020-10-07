import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BuscadorLocalidadEspectaculoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'buscadorLocalidadEspectaculo',
})
export class BuscadorLocalidadEspectaculoPipe implements PipeTransform {

  static readonly LABEL_TODOS_LOS_ESPECTACULOS: string = 'Todas';

  /**
   * Takes a value and makes it lowercase.
   */
  transform(espectaculos: any[], localidad: any) : any {

    if (!espectaculos || !localidad || localidad == BuscadorLocalidadEspectaculoPipe.LABEL_TODOS_LOS_ESPECTACULOS) {
      return espectaculos;
    }

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return espectaculos.filter(function(item) {
      if (item.establecimiento.direccion) {
        return item.establecimiento.direccion.localidad.nombre.toLowerCase().indexOf(localidad.toLowerCase()) !== -1;
      } else {
        return true;
      }
    });
  }
}
