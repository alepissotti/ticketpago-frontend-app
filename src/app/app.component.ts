import { LISTADO_VENTA_DIARIA, PROFILE_PAGE, USER_CHANGE_PASSWORD_PAGE, DETALLES_OPERACION_PAGE, LISTADO_VENTAS_PUNTO_VENTA_PAGE, ENTREGA_TICKETS_PAGE, LISTADO_OPERACIONES_A_ENTREGAR_PAGE, IMPRESION_TICKETS_PAGE } from './../pages/pages';
import {Component, ViewChild} from '@angular/core';
import {Events, LoadingController, Nav, NavController, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {PrinterProvider, UsuarioProvider} from "../providers/providers";

import {
  ANULAR_PAGE,
  CARTELERA_PAGE, ESPECTACULOS_DISPONIBLES_PAGE, ESPECTACULOS_DISPONIBLES_PRODUCTOR_PAGE, IMPRESIONES_PENDIENTES_PAGE,
  INGRESO_PUNTO_VENTA_PAGE, LOGIN_PAGE, REIMPRESION_COMPROBANTES_PAGE,
  RESERVAS_PAGE, SALIDA_PAGE, DESPACHOS_PAGE, CAJA_SISTEMA_PAGE, CAJAS_CERRADAS_PAGE, LISTADO_BORDERAUX_PAGE,
  DEVOLUCIONES_LINE_PAGE,VENTA_PAGE,
} from "../pages/pages";
import {VentaFinalizadaPage} from "../pages/venta-finalizada/venta-finalizada";
import {SideMenuSettings} from "../components/side-menu-content/models/side-menu-settings";
import {SideMenuOption} from "../components/side-menu-content/models/side-menu-option";
import {SideMenuContentComponent} from "../components/side-menu-content/side-menu-content.component";
import {MensajeProvider} from "../providers/mensaje/mensaje";
import { ApiProvider } from '../providers/api/api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) nav: NavController;
  @ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

  userInfo: any;
  public sideMenuSettings: SideMenuSettings = {
    accordionMode: true,
    arrowIcon: 'add',
    showSelectedOption: true,
    selectedOptionClass: 'selected-menu-item'
  };

  menuItems: Array<any>;
  cuentaTercero : boolean;

  redireccionACarteleraHabilitada: boolean = true;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public api: ApiProvider,
              public menuCtrl: MenuController,
              private loadingCtrl: LoadingController,
              private mensaje: MensajeProvider,
              private printer: PrinterProvider,
              private usuario: UsuarioProvider,
              public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.menuItems = null;

    this.rootPage = LOGIN_PAGE;

    this.listenToLoginEvents();

    this.usuario.loginStatus().subscribe();
    this.usuario.checkLoginStatus();
    
  }

  /**
   * Función para detectar:
   * - logins y logouts del usuario.
   * - comienzo de nuevas compras del usuario.
   */
  listenToLoginEvents() {
    this.events.subscribe(UsuarioProvider.EVENT_USUARIO_LOGUEADO, () => {
      this.actualizarMenuUsuario();
    });

    this.events.subscribe(UsuarioProvider.EVENT_USUARIO_DESLOGUEADO, () => {
      this.userInfo = null;
    });

    this.events.subscribe(VentaFinalizadaPage.EVENT_NUEVA_VENTA, () => {
      this.iniciarNuevaVenta();
    })
  }

  /**
   * Función para evitar la redirección del usuario a la cartelera.
   * Esta pensada principalmente para cuando el usuario viene del sistema viejo de ticketway
   */
  noRedireccionarACartelera() {
    this.redireccionACarteleraHabilitada = false;
  }

  /**
   * Principal función para la carga del menu del usuario
   */
  actualizarMenuUsuario() {
    
    
    if (!this.usuario) {
      this.menuItems = null;
      this.goPage(LOGIN_PAGE);
    } else {

    this.userInfo = this.usuario.getUser();

    if (!Object.keys(this.userInfo).length) {
      this.userInfo = null;
    }

    this.menuItems = [];

    if (!this.userInfo) {
      this.menuItems = null;
      this.goPage(LOGIN_PAGE);
    } else {

    if (this.usuario.isPuntoDeVentaOnline()) {

      if (this.usuario.permiso(this.usuario.PERMISO_VENTA_REGISTRAR)) {
        this.menuItems.push(this.getRedirectMenuItem('Login', LOGIN_PAGE));
      }

      this.cargaMenuUsuario();

      if(this.redireccionACarteleraHabilitada) {
        this.goPage(LOGIN_PAGE);
      }

    } else {

      let ventaItems = [];
      let cajaItems = [];
      let reporteItems = [];
      this.cuentaTercero = this.usuario.esCuentaTercero();

      if (this.usuario.permiso(this.usuario.PERMISO_VENTA_REGISTRAR) ) {
        ventaItems.push(this.getRedirectMenuItem('Cobranzas', VENTA_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_VENTA_REGISTRAR) ) {
        ventaItems.push(this.getRedirectMenuItem('Reimpresión de comprobantes', REIMPRESION_COMPROBANTES_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_OPERACIONES_A_ENTREGAR)) {
        ventaItems.push(this.getRedirectMenuItem('Entrega de tickets', ENTREGA_TICKETS_PAGE));
      }

      if(this.usuario.permiso(this.usuario.PERMISO_LISTADO_OPERACIONES_A_IMPRIMIR)) {
        ventaItems.push(this.getRedirectMenuItem('Impresión de tickets',IMPRESION_TICKETS_PAGE));
      }

      /*if(this.usuario.permiso(this.usuario.PERMISO_VENTA_REGISTRAR)) {

        ventaItems.push(this.getRedirectMenuItem('Impresiones pendientes', IMPRESIONES_PENDIENTES_PAGE));

        ventaItems.push({
          displayText: 'Estado de impresora',
          custom: {
            action: this.checkPrinterStatus,
          }
        })
      }*/

      if (this.usuario.permiso(this.usuario.PERMISO_RESERVAR_EMITIR_LIBERAR)) {
        ventaItems.push(this.getRedirectMenuItem('Reservas',RESERVAS_PAGE));
      }

      /*if (this.usuario.permiso(this.usuario.PERMISO_ANULAR)) {
        ventaItems.push(this.getRedirectMenuItem('Anular ventas',ANULAR_PAGE));
      }*/

      if (this.usuario.permiso(this.usuario.PERMISO_EDITAR_ESTADO_ENVIO)) {
        ventaItems.push(this.getRedirectMenuItem('Despachos',DESPACHOS_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_DETALLE_OPERACION)) {
        ventaItems.push(this.getRedirectMenuItem('Detalle operaciones',DETALLES_OPERACION_PAGE))
      }

      if (this.usuario.permiso(this.usuario.PERMISO_DEVOLUCION) ) {
        ventaItems.push(this.getRedirectMenuItem('Devoluciones',DEVOLUCIONES_LINE_PAGE) );
      }

      if (this.usuario.permiso(this.usuario.PERMISO_GESTIONAR_CAJA)) {
        cajaItems.push(this.getRedirectMenuItem('Cerrar Cajas',CAJA_SISTEMA_PAGE));

        cajaItems.push(this.getRedirectMenuItem('Listar Cajas',CAJAS_CERRADAS_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_OPERACIONES_A_ENTREGAR)) {
        reporteItems.push(this.getRedirectMenuItem('Listado Tickets a entregar', LISTADO_OPERACIONES_A_ENTREGAR_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_BORDERAUX)) {
        reporteItems.push(this.getRedirectMenuItem('Listado Borderaux',LISTADO_BORDERAUX_PAGE));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_VENTA_DIARIA)) {
        reporteItems.push(this.getRedirectMenuItem('Listado Venta Diaria',LISTADO_VENTA_DIARIA));
      }

      if (this.usuario.permiso(this.usuario.PERMISO_LISTADO_DETALLE_FUNCION_PLANO_CONFIGURACION)) {
        reporteItems.push(this.getRedirectMenuItem('Vista Espectaculos y Planos',ESPECTACULOS_DISPONIBLES_PRODUCTOR_PAGE));
      }

      if(this.usuario.permiso(this.usuario.PERMISO_LISTADO_VENTA_PUNTO_VENTA)) {
        reporteItems.push(this.getRedirectMenuItem('Liquidación de espectaculos',LISTADO_VENTAS_PUNTO_VENTA_PAGE));
      }

      if (ventaItems.length) {
        this.menuItems.push({
          displayText: 'Venta',
          suboptions: ventaItems,
        })
      }

      if (cajaItems.length) {
        this.menuItems.push({
          displayText: 'Caja',
          suboptions: cajaItems
        })
      }

      if (reporteItems.length) {
        this.menuItems.push({
          displayText: 'Reportes',
          suboptions: reporteItems
        })
      }

      /* Opciones del usuario */
      this.cargaMenuUsuario();

      /*if (!this.usuario.permiso(this.usuario.PERMISO_LISTADO_BORDERAUX)) {
        this.goIngresoProductor();
      } else {*/
      this.goIngresoPuntoVenta();
      //}
    }}}
  }

  /**
   * Función que carga los menues comunes de los usuarios, como ser, cambio de password, perfil, salir del sistema, etc.
   */
  cargaMenuUsuario() {

    let usuarioItems = [];

    usuarioItems.push(this.getRedirectMenuItem('Cambio de contraseña',USER_CHANGE_PASSWORD_PAGE));

    this.menuItems.push({
      displayText: 'Mi Perfil',
      suboptions: usuarioItems
    });

    /*this.menuItems.push({
      displayText: 'Salir',
      custom: {
        action: this.salirClicked,
      }
    });*/

    this.cuentaTercero = this.usuario.esCuentaTercero();
  }

  iniciarNuevaVenta = () => {


      this.userInfo = this.usuario.getUser();

      if(!Object.keys(this.userInfo).length) {
        this.userInfo = null;
      }

      if(this.userInfo) {
        if (this.usuario.isPuntoDeVentaOnline()) {
          this.nav.pop();
        } else {
          this.nav.pop();
        }
      } else {
        this.nav.pop();
      }

  };

  goIngresoPuntoVenta() {
    this.nav.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  goToLogin() {
    this.nav.setRoot(LOGIN_PAGE);
  }

  goIngresoProductor = () => {
    this.nav.setRoot(ESPECTACULOS_DISPONIBLES_PRODUCTOR_PAGE);
  }

  goPage = (pageName) => {
    this.nav.push(pageName);
  }

  salirClicked = () => {
    this.mensaje.presentar(
      'Salir del sistema',
      '¿Esta seguro que desea salir del sistema?',
      {
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Salir',
            handler: () => {
              this.salirSistema();
            },
          }]
      }
    );
  }

  salirSistema() {
    this.nav.setRoot(SALIDA_PAGE);

    setTimeout(() => {
      this.usuario.logout();
    }, 1000);


  }

  checkPrinterStatus = () => {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.printer.status().then(response => {
      loading.dismissAll();
      this.mensaje.presentar('ESTADO IMPRESORA', 'SERVIDOR DE IMPRESION ACTIVO', {buttons: ['Ok']});
    }).catch(error => {
      loading.dismissAll();
      this.mensaje.presentar('ESTADO IMPRESORA', 'ERROR EN SERVIDOR DE IMPRESION', {buttons: ['Ok']});
    })
  }

  onOptionSelected = (option: SideMenuOption) => {
    option.custom.action()
    this.sideMenu.collapseAllOptions();
    this.menuCtrl.close();
  }

  refreshSite() {
    location.reload(true);
  }

  /**
   * Función para obtener un menu item con redirección a alguna página del sistema
   * 
   * @param label 
   * @param pageRedirect 
   */
  getRedirectMenuItem(label, pageRedirect) {
    return {
      displayText: label,
      custom: {
        action: () => { this.goPage(pageRedirect); },
      }
    }
  }
}