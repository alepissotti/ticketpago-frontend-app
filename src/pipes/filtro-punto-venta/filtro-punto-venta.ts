import {Injectable, Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the FiltroPuntoVentaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filtroPuntoVenta',
})
export class FiltroPuntoVentaPipe implements PipeTransform {
  /**
   * Filtra una colección de cajas por punto de venta
   */
  transform(cajas: any[], puntoVenta: any) : any {

    if (!cajas || !puntoVenta.id) {
      return cajas;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return cajas.filter(function(item) {
      return item.punto_venta.id == puntoVenta.id });
  }
}
