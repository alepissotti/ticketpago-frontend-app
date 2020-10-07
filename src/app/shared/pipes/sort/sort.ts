import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the FiltroPuntoVentaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  /**
   * Ordena un array de objetos implementandolo de la siguiente manera --> | sort: {property: 'nombre propiedad', order: 'Este valor puede ser 1 o -1 de acuerdo a que se quiera orden ascendente o descendente}
   */
  transform(array: Array<string>, args?: any): Array<any> {
    if(array) {
        array = array.sort(function(a, b){
            if(a[args.property] < b[args.property]){
                return -1 * args.order;
            }
            else if( a[args.property] > b[args.property]){
                return 1 * args.order;
            }
            else{
                return 0;
            }
          });
    }

    return array;
  }
}
