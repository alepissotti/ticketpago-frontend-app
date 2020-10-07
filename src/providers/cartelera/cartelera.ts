import { UsuarioProvider } from './../usuario/usuario';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class CarteleraProvider {

  espectaculoElegido: any;
  espectaculos: any[];
  empresa: any;

  constructor(public api: ApiProvider) {
    this.espectaculoElegido = {};
  }

  getCartelera(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("carteleras", {}).then(response => {
        this.empresa = response.data.empresa;
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  setSelectedEspectaculo(espectaculo) {
    this.espectaculoElegido = espectaculo;
  }

  getEspectaculoSeleccionado() {
    this.espectaculoElegido;
  }

  /**
   * Función que retorna la empresa de la cartelera
   * 
   * Es usada para mostrar los datos de contacto de la empresa
   */
  getEmpresa() {
    return this.empresa;
  }

  /**
   * Función para redireccionar al sitio de ticketway
   * solo si se esta en producción
   */
  redireccionSiEnProduccion(usuario: UsuarioProvider) {
    if(this.api.enProduccion()) {
      if(usuario.estaLogueado()) {
        usuario.logout();
      }
      //window.location.href = 'http://www.ticketway.com.ar';
    }
  }

  getParameterByName(name, url = null) {
    return this.api.getParameterByName(name,url);
  }

}
