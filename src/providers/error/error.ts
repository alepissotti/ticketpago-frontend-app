import {Injectable} from '@angular/core';
import {environment} from "../../environment/environment";
import {UsuarioProvider} from "../usuario/usuario";
import {MensajeProvider} from "../mensaje/mensaje";

@Injectable()
export class ErrorProvider {

  constructor(private usuario: UsuarioProvider,
              private mensaje: MensajeProvider) {
  }

  handle(error: { error?: any, text?: string, logLevel?: string }) {
    if (environment.debug) {
      if (error.logLevel == 'log') {
        console.log(error.error);
      }
      if (error.logLevel == 'error') {
        console.error('[ERROR]: ', error.error);
      }
    }
    if (error.error && error.error.status == 401) {
      this.usuario.logout();
    }
    console.log(error);
    this.mensaje.presentar(null, error.text? error.text: 'Ha ocurrido un error. Intente nuevamente mas tarde.', null, 3000);
  }

}
