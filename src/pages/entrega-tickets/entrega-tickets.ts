import { LoadingController } from 'ionic-angular';
import { MensajeProvider } from './../../providers/mensaje/mensaje';
import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { VentaProvider } from './../../providers/venta/venta';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EntregaTicketsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrega-tickets',
  templateUrl: 'entrega-tickets.html',
})
export class EntregaTicketsPage {

  dniTitularTarjeta: string;
  operaciones: any = [];
  selectedOperaciones: any[];
  busquedaIniciada = false;

  constructor(public loadingCtrl: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private mensaje: MensajeProvider,
              private ventaProvider: VentaProvider) {
    this.selectedOperaciones = [];
  }

  buscarOperaciones() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.ventaProvider.getOperacionesSegunDniTitularTarjeta({dni: this.dniTitularTarjeta}).then(response => {
      this.busquedaIniciada = true;
      loading.dismissAll();
      this.operaciones = response.operaciones;
    }).catch(error => {
      loading.dismissAll();
      console.log(error);
    });
  }

  closeKeyboard() {
    this.buscarOperaciones();
    let activeElement = <HTMLElement>document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();
  }

  entregarTickets(operacion) {
    console.log(operacion);
  }

  operacionClicked(id) {
    let index = this.selectedOperaciones.indexOf(id);
    if (index > -1) {
      this.selectedOperaciones.splice(index, 1);
    } else {
      this.selectedOperaciones.push(id);
    }
  }

  siguienteEstadoClicked() {
    if(this.selectedOperaciones.length == 0) {
      this.mensaje.presentar(null, 'Debe seleccionar al menos una operación.', null, 3000);
    } else {

      let loading = this.loadingCtrl.create();
      loading.present();

      this.ventaProvider.setSiguienteEstadoEnvio({'operacionesIds': this.selectedOperaciones}).then(response => {

        this.limpiarOperaciones();
        loading.dismissAll();
        this.buscarOperaciones();

      }).catch(error => {
        console.log(error);
        loading.dismissAll();
      });

    }
  }

  limpiarOperaciones() {
    this.operaciones = [];
    this.selectedOperaciones = [];
    this.mensaje = null;
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

}
