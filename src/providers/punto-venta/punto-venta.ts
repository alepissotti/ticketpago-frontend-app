import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

/*
  Generated class for the PuntoVentaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PuntoVentaProvider {

  constructor(public api: ApiProvider) {
  }

  getPuntoVenta(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/buscarpuntosventas",{'datos': datos}).then(response => {
        resolve(response.data);
      }).catch( error => {
        reject(error);
      });  
    })
  }
}
