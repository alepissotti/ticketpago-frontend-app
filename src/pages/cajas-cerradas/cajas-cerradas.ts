import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ErrorProvider} from "../../providers/error/error";
import {CajaProvider} from "../../providers/caja/caja";
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";
import {PuntoVentaProvider} from "../../providers/punto-venta/punto-venta";
import {UsuarioProvider} from "../../providers/providers";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

/**
 * Generated class for the CajasCerradasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cajas-cerradas',
  templateUrl: 'cajas-cerradas.html',
})
export class CajasCerradasPage {

  datosCaja: any;
  cajas: any[];
  cajasSeleccionadas: any[];
  puntosVenta: any[];
  tipoSalidaReporte: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public error: ErrorProvider,
              public loadingCtrl: LoadingController,
              private mensaje: MensajeProvider,
              private usuario: UsuarioProvider,
              public caja: CajaProvider,
              public puntoVentaProvider: PuntoVentaProvider) {

    this.datosCaja = {};
    this.cajasSeleccionadas = [];
    this.puntosVenta = [];
  }

  ionViewDidLoad() {
    if(this.usuario.permiso(this.usuario.PERMISO_GESTIONAR_CAJA_TODAS)) {
      let loading = this.loadingCtrl.create();
      loading.present();

      this.puntoVentaProvider.getPuntoVenta({}).then((response) => {

        //Inicializa inputs de fechas
        let d = new Date(); 
        let day = d.getDay()+1; if(day<10) {var stringDay = '0' + day.toString()};
        let month = d.getMonth()+1; if(month<10) {var stringMonth = '0' + month.toString()};
        let year = d.getFullYear();

        this.datosCaja.fecDesdeApertura = year+'-'+stringMonth+'-'+stringDay;
        this.datosCaja.fecHastaApertura = year+'-'+stringMonth+'-'+stringDay;

        this.puntosVenta = response.puntos_venta;
        loading.dismissAll();

      }).catch(error => {
        error.logLevel = 'error';
        this.error.handle(error);
        loading.dismissAll();
      })
    }

  }

  buscarCajas() {

    if(this.validarDatosBusquedaCaja()) {
      let loading = this.loadingCtrl.create();
      loading.present();

      this.caja.getCajasCerradas(this.datosCaja).then((response) => {

        this.cajasSeleccionadas = [];

        this.cajas = response.cajas;
        loading.dismissAll();
      })
        .catch(error => {

          error.logLevel = 'error';
          this.error.handle(error);
          loading.dismissAll();
        });
    }
  }

  validarDatosBusquedaCaja() {

    let valido = true;
    let stringError;

    if(!this.datosCaja.fecDesdeApertura) {
      stringError = '- Ingrese fecha desde apertura de caja para realizar la busqueda\n';
      valido = false;
    }

    if(this.datosCaja.fecHastaApertura) {
      if (this.datosCaja.fecDesdeApertura > this.datosCaja.fecHastaApertura) {
        stringError = '- Fecha Desde Apertura no puede ser mayor que Fecha Hasta Apertura\n';
        valido = false;
      }
    }

    if(this.datosCaja.puntoVenta == 0) {
      this.datosCaja.puntoVenta = null;
    }

    if(!valido) {
      this.mensaje.presentar(
        'Datos Ingresados Incorrectos',
        stringError,
        {
          buttons: ['Ok']
        }
      );
    }

    return valido;
  }

  cajasClicked(id) {
    let index = this.cajasSeleccionadas.indexOf(id);
    if (index > -1) {
      this.cajasSeleccionadas.splice(index, 1);
    } else {
      this.cajasSeleccionadas.push(id);
    }
  }

  imprimirListadosCajasClicked() {
    if(!this.cajasSeleccionadas || !this.cajasSeleccionadas.length) {
      this.mensaje.presentar(null, 'Debe seleccionar cajas para poder listarlas', null, 3000);
    } else {
      this.caja.imprimirResumenCajas(this.usuario, this.cajasSeleccionadas, this.tipoSalidaReporte);
    }

  }

  setTipoSalida(event) {
    this.tipoSalidaReporte = event.tipoSalida;
  }

  salirClicked() {
    this.navCtrl.pop();
  }

}
