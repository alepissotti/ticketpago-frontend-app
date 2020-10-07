import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TiempoRestanteVentaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'tiempoRestanteVenta',
})
export class TiempoRestanteVentaPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {

    return value;
  }
}
