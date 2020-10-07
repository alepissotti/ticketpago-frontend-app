import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from "../../environment/environment";
import {UsuarioProvider} from "../usuario/usuario";

@Injectable()
export class PrinterProvider {

  apiConfig: any;
  timeout: number;

  constructor(private http: Http,
              private usuario: UsuarioProvider) {
    this.apiConfig = environment.apiConfig;
    this.timeout = 15000;
  }

  getUrlPrinter(): string {
    return this.usuario.getUser().punto_venta.configuracion_punto_venta.servidor_impresion;
  }

  getPrinterName(): string {
    return this.usuario.getUser().punto_venta.configuracion_punto_venta.impresora_ticket;
  }

  getUrlBackend(): string {
    return this.apiConfig.backend.url;
  }

  /**
   *
   * @returns {Promise<any>}
   */
  status(): Promise<any> {
    return this.http.post(this.getUrlPrinter() + "status", {})
      .timeout(this.timeout)
      .toPromise()
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      })
  }

  /**
   *
   * @param {number} operacionId
   * @returns {Promise<any>}
   */
  print(operacionId: number): Promise<any> {
    let userToken = this.usuario.token;
    if (!userToken) {
      return Promise.reject('El usuario no se encuentra logueado');
    }
    if (this.usuario.isPuntoDeVentaOnline()) {
      return Promise.reject('El usuario no esta habilitado para imprimir');
    }
    let params = JSON.stringify({operacionId: operacionId, token: 'Bearer ' + userToken, impresora: this.getPrinterName(), servidor: this.getUrlBackend()});
    return this.http.post(this.getUrlPrinter() + "printticket", params)
      .timeout(this.timeout)
      .toPromise()
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        //console.log(error);
        let errorImpresora = {
          'logLevel': 'error',
          'error': 'Se ha generado un error en la impresion',
          'text': 'Se ha generado un error en la impresion, verifique que tenga la impresora instalada'
        };
        return Promise.reject(errorImpresora);
      })
  }

}
