import {Pipe, PipeTransform} from '@angular/core';
import {environment} from "../../environment/environment";

@Pipe({
  name: 'baseUrl',
})
export class BaseUrlPipe implements PipeTransform {

  transform(value: string) {
    let valueToReturn = ''
    if(value) {
      valueToReturn = environment.apiConfig.backend.url + value;
    }
    return valueToReturn;
  }

}
