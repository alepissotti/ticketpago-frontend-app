import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiProvider} from "../api/api";

@Injectable()
export class CajaProvider {

  constructor(public api: ApiProvider) {
  }

  getCajasAbiertas(): Promise<any> {
    let param: any = {};

    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("buscarcajasabiertas", param)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      })
    });

  }

  getCajasCerradas( params ): Promise<any> {

    let datos = {
      'datos': params
    }

    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("buscarcajascerradas", datos)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  imprimirResumenCajas(user, cajaIds, tipoSalidaReporte) {
      let cajaIdsString = '';
  
      for(let i=0; i<cajaIds.length; i++) {
        cajaIdsString += cajaIds[i] + ',';
      }
  
      cajaIdsString = cajaIdsString.substring(0, cajaIdsString.length - 1);
  
      this.api.windowOpenWithAuthorization(user, "listadocajas", {'idsCajas': cajaIdsString, 'tipo_salida': tipoSalidaReporte });
  
  }

  cerrarCaja(cajaId): Promise<any> {
    let param: any = {
      "cajaId": cajaId,
    }

    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("cerrarcajas", param)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        })
    })
  }

}
