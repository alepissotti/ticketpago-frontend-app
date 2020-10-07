import {Injectable} from '@angular/core';
import {ApiProvider} from "../api/api";
import {getHttpHeadersOrInit, HttpInterceptorService} from "ng-http-interceptor";
import {Observable} from "rxjs/Observable";
import {Events} from "ionic-angular";
import {MensajeProvider} from "../mensaje/mensaje";
import { LoadingController} from 'ionic-angular';
import {environment} from '../../environment/environment';

//Eventos

@Injectable()
export class UsuarioProvider {

  // Constantes de permiso
  PERMISO_VENTA_REGISTRAR : string = 'venta_registrar';
  PERMISO_ANULAR: string = 'venta_anular';
  PERMISO_PREIMPRIMIR: string = 'venta_preimprimir';
  PERMISO_RESERVAR: string = 'venta_reservar';
  PERMISO_RESERVAR_EMITIR_LIBERAR: string ='venta_reserva_emitir_liberar';
  PERMISO_LISTADO_BORDERAUX: string = 'listado_borderaux';
  PERMISO_LISTADO_DETALLE_OPERACION: string = 'listado_detalle_operacion';
  PERMISO_LISTADO_VENTA_DIARIA: string = 'listado_venta_diaria';
  PERMISO_LISTADO_DETALLE_FUNCION_PLANO_CONFIGURACION: string = 'listado_detalle_funcion_plano_configuracion';
  PERMISO_LISTADO_VENTA_PUNTO_VENTA: string = 'listado_venta_punto_venta';
  PERMISO_LISTADO_VENTA_PUNTO_VENTA_COMPLETO: string = 'listado_venta_punto_venta_completo';
  PERMISO_EDITAR_ESTADO_ENVIO: string = 'editar_estado_envio';
  PERMISO_GESTIONAR_CAJA: string = 'gestionar_caja';
  PERMISO_GESTIONAR_CAJA_TODAS: string = 'gestionar_caja_todas';
  PERMISO_LISTADO_OPERACIONES_A_ENTREGAR: string = 'listado_operaciones_a_entregar';
  PERMISO_LISTADO_OPERACIONES_A_IMPRIMIR: string = 'listado_operaciones_a_imprimir';
  PERMISO_LISTADO_VENTA_BUSQUEDA_PUNTO_VENTA: string = 'listado_venta_busqueda_punto_venta';
  PERMISO_DEVOLUCION: string = 'venta_devolucion';

  static readonly EVENT_USUARIO_DESLOGUEADO: string = 'usuario:loggedOut';
  static readonly EVENT_USUARIO_LOGUEADO: string = 'usuario:loggedIn';

  token: string;
  user: any;
  username: string;
  password: string;
  userStatus: any;
  userStatusObserver: any;
  urlLinkPago: any;

  constructor(public events: Events,
              private api: ApiProvider,
              public loadingCtrl: LoadingController,
              private mensaje: MensajeProvider,
              private httpInterceptor: HttpInterceptorService) {
    this.setAuthInterceptor();
    this.userStatus = Observable.create(observer => {
      this.userStatusObserver = observer;
    });
    this.urlLinkPago = environment.apiConfig.linkPago.url;
  }

  setAuthInterceptor() {
    this.httpInterceptor.request().addInterceptor((data, method) => {
      if (this.token) {
        const headers = getHttpHeadersOrInit(data, method);
        headers.set('Authorization', 'Bearer ' + this.token);
        headers.set('Content-Type', 'application/json');
      }
      return data;
    })
  }

  getToken() {
    return this.token;
  }

  loginStatus(): Observable<any> {
    return this.userStatus;
  }

  checkLoginStatus() {
    if (this.token) {
      this.updateDatosUsuario().then(() => {
        this.userStatusObserver.next('loggedIn');
        this.events.publish(UsuarioProvider.EVENT_USUARIO_LOGUEADO);
      }).catch(error => {
        this.mensaje.presentar(null, 'Hubo un problema de autenticación. Debe iniciar sesión nuevamente', null, 3000);
        this.userStatusObserver.next('');
      })
    } else {
      this.token = window.sessionStorage['twnLoginToken'];
      this.user = {};
      if (window.sessionStorage['twnUser']) {
        this.user = JSON.parse(window.sessionStorage['twnUser']);
      }
      if (this.token) {
        this.updateDatosUsuario().then(() => {
          this.userStatusObserver.next('loggedIn');
          this.events.publish(UsuarioProvider.EVENT_USUARIO_LOGUEADO);
        }).catch(error => {
          this.mensaje.presentar(null, 'Hubo un problema de autenticación. Debe iniciar sesión nuevamente', null, 3000);
          this.userStatusObserver.next('');
        })
      } else {
        this.userStatusObserver.next('');
      }
    }
  }
  updateDatosUsuario() {
    return this.api.postToUrlBackend("datosusuarios", {}).then(response => {
      this.user = response;
      window.sessionStorage['twnUser'] = JSON.stringify(this.user);
      this.userStatusObserver.next('loggedIn');
    });
  }

  estaLogueado() {

    if(this.user) {
      if (!Object.keys(this.user).length) {
        return false;
      }

      return true;
    }

    return false;

  }

  getUser() {

    if(this.user) {
      if (!Object.keys(this.user).length) {
        this.user = {}
      }
    }

    return Object.assign({}, this.user);
  }

  getMaxUbicaciones() {
    if (this.user && this.user.punto_venta) {
      return this.user.punto_venta.max_venta_ubicaciones;
    } else {
      return null;
    }
  }

  isPuntoDeVentaOnline(): boolean {
    if (this.user && this.user.punto_venta) {
      return !!this.user.punto_venta.es_online;
    } else {
      return null;
    }
  }

  login(account: {username: string, password: string}): Promise<any> {
    let loading = this.loadingCtrl.create();
    loading.present();

    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("login", account).then(response => {
        loading.dismiss();
        this.token = response.token;
        window.sessionStorage['twnLoginToken'] = this.token;
        this.user = response.usuario;
        window.sessionStorage['linkPago'] = btoa(account.username + '->' + account.password);
        window.sessionStorage['twnUser'] = JSON.stringify(this.user);
        this.userStatusObserver.next('loggedIn');
        this.events.publish(UsuarioProvider.EVENT_USUARIO_LOGUEADO);
        resolve();
      }).catch(error => {
        loading.dismiss();
        this.userStatusObserver.next('');
        reject(error);
      })
    })
  }

  loginUsuario(usuario) {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("login", usuario).then(response => {
        this.token = response.token;
        this.username = usuario.username;
        this.password = usuario.password;
        this.user = response.usuario;
        this.userStatusObserver.next('loggedIn');
        resolve();
      }).catch(error => {
        this.userStatusObserver.next('');
        reject(error);
      })
    })
  }

  

  logout() {
    delete this.token;
    delete this.user;
    window.sessionStorage.clear();
    this.userStatusObserver.next('');
    this.events.publish(UsuarioProvider.EVENT_USUARIO_DESLOGUEADO);
  }

  logoutUsuario() {
    delete this.token;
    delete this.user;
    window.sessionStorage.clear();
    this.userStatusObserver.next('');
  }


  permiso(permiso) {
    let user = this.getUser();
    let permisosUsuario =  user.permisos;

    if(permisosUsuario) {
      for (let permisoUsuario of permisosUsuario) {
        if (permisoUsuario.nombre == permiso) {
          return true;
        }
      }
    }

    return false;

  }

  getEmail() {
    return this.user.email;
  }

  getPuntoVenta() {
    return this.user.punto_venta;
  }

  noImprimeTicket() {
    return this.getPuntoVenta().no_imprime_ticket;
  }

  puedeReservarOPreimprimir() {
    return this.permiso(this.PERMISO_PREIMPRIMIR) || this.permiso(this.PERMISO_RESERVAR);
  }

  changePassword(account: {old_password: string, new_password: string, repeated_new_password: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("changepassword", account).then(response => {
        resolve();
      }).catch(error => {
        this.userStatusObserver.next('');
        reject(error);
      })
    })
  }

  getDatosParaRegistro(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("persona/datospararegistros", {}).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    });
  }

  recoverPass(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("password/reset", {email: email}).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    });
  }

  register(account): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("registro", account).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    });
  }

  esCuentaTercero() : boolean {
    let usuarioPuntoVenta = this.getPuntoVenta();
    if (usuarioPuntoVenta != null) return usuarioPuntoVenta.cuenta_tercero;
    else return false;
  }

  tieneServicioLinkPago() : boolean {
    const limite_link_pago = this.getPuntoVenta().limite_link_pago;
    if (limite_link_pago === null) return false;
    else return true;
  }



}
