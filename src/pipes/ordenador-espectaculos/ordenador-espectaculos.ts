import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OrdenadorEspectaculosPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'ordenadorEspectaculos',
})
export class OrdenadorEspectaculosPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(array: any[], args?: any) {
console.log(array);

    if (array) {
      return array.sort((a, b) => {
        if (a[args.property] > b[args.property]) {
          return 1;
        }
        if (a[args.property] < b[args.property]) {
          return -1;
        }
        return 0;
      });
    } else {
      return null;
    }
  }


}
