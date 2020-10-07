
import {Injectable, Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the FiltroPuntoVentaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filtroLocalidadSegunCodigoPostalPipe',
})
export class FiltroLocalidadSegunCodigoPostalPipe implements PipeTransform {
  /**
   * Filtra una colección de cajas por punto de venta
   */
  transform(localidades: any[], codPostal: any) : any {

    if (!localidades || !codPostal) {
      return localidades;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return localidades.filter(function(item) {
      return item.cod_postal.indexOf( codPostal ) == 0;
    });
  }
}
