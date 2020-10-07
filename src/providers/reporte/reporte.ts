import { UsuarioProvider } from './../usuario/usuario';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiProvider} from "../api/api";

/*
  Generated class for the ReporteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReporteProvider {

  constructor(public api: ApiProvider,
              public usuarioProvider: UsuarioProvider) {
  }

  getListadoOperacionesAImprimir(params: {espectaculoId: string, tipoEnvioId: string, ordenPorDocumento: boolean, tipo_salida: string }) {
    this.api.windowOpenWithAuthorization(this.usuarioProvider, "listadooperacionesaentregar", params);
  }

  imprimirBorderaux(params: {}){
    this.api.windowOpenWithAuthorization(this.usuarioProvider, "borderauxs", params);
  }

  imprimirListadoVentaDiaria(params: {}) {
    this.api.windowOpenWithAuthorization(this.usuarioProvider, "ventasdiarias", params);
  }

  imprimirListadoVentasPuntoVenta(params) {
    this.api.windowOpenWithAuthorization(this.usuarioProvider, "listadoventaspuntoventas", params);
  }

  ventaEntradaSistemaMostrador(params) {
    this.api.windowOpenWithAuthorization(this.usuarioProvider, "venta/funcs", params);
  }
}
