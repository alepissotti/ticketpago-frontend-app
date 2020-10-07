import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";
import {CajaProvider} from "../../providers/caja/caja";
import {ErrorProvider, UsuarioProvider} from "../../providers/providers";
import {FiltroPuntoVentaPipe} from "../../pipes/filtro-punto-venta/filtro-punto-venta";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage()
@Component({
  selector: 'page-caja-sistema',
  templateUrl: 'caja-sistema.html',
  providers: [FiltroPuntoVentaPipe],
})
export class CajaSistemaPage {

  loading: boolean;
  cajas: any[];
  puntos_venta: any[];
  puntoVentaSeleccionado: any;
  cajasSeleccionadas: any[];
  loadingSpinner: any;
  tipoSalidaReporte: any;

  constructor(public navCtrl: NavController,
              private error: ErrorProvider,
              public navParams: NavParams,
              private mensaje: MensajeProvider,
              private loadingCtrl: LoadingController,
              public caja: CajaProvider,
              public filtroPuntoVenta: FiltroPuntoVentaPipe,
              private usuario: UsuarioProvider
            ) {

    this.loading = false;
    this.cajas = [];
    this.puntos_venta = [];
    this.cajasSeleccionadas = [];
    this.puntoVentaSeleccionado = {};
  }

  ionViewDidLoad() {
    this.getCajas();
  }

  getCajas() {
    this.cajasSeleccionadas = [];
    let loading = this.loadingCtrl.create();
    loading.present();

    this.caja.getCajasAbiertas().then((response) => {

      this.cajas = response.cajas;
      this.puntos_venta = response.puntos_venta;
      loading.dismissAll();
      })
      .catch(error => {

        error.logLevel = 'error';
        this.error.handle(error);
        loading.dismissAll();
      });
  }

  cerrarCajaClicked() {
    this.mensaje.presentar(
      'Confirmar cerrar caja',
      '¿Esta seguro/a que desea cerrar la caja seleccionada?',
      {
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Continuar',
            handler: () => {
              this.cerrarCajas(0);
            }
          }
        ]
      }
    );
  }

  cerrarCajas(i) {
    let cajas = this.cajasSeleccionadas;

    if (i == 0) {
      this.loadingSpinner = this.loadingCtrl.create();
      this.loadingSpinner.present();
    }

    if(i <= cajas.length - 1){
      this.cerrarCaja(i);
    } else {

      this.loadingSpinner.dismissAll();

      this.mensaje.presentar(
        'Cajas cerradas con éxito',
        'Precione Aceptar para que el pdf con el resumen de operaciones realizadas sea descargado',
        {
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.caja.imprimirResumenCajas(this.usuario, cajas, this.tipoSalidaReporte);
              this.getCajas();
            }
          }
          ]
        }
      );
    }

  }

  cerrarCaja(i) {

    let cajas = this.cajasSeleccionadas;

    this.caja.cerrarCaja(cajas[i]).then(response => {

      i++;
      this.cerrarCajas(i);

    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
      this.loadingSpinner.dismissAll();
    });

  }

  cajasClicked(id) {
    let index = this.cajasSeleccionadas.indexOf(id);
    if (index > -1) {
      this.cajasSeleccionadas.splice(index, 1);
    } else {
      this.cajasSeleccionadas.push(id);
    }
  }

  setTipoSalida(event) {
    this.tipoSalidaReporte = event.tipoSalida;
  }

  salirClicked() {
    this.navCtrl.pop();
  }

  listar(id) {
    this.caja.imprimirResumenCajas(this.usuario, [id], this.tipoSalidaReporte);
  }

}
