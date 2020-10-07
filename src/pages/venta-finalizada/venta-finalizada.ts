import { TimerProvider } from './../../components/resumen-venta/provider/timer';
import { Component } from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {VentaProvider} from "../../providers/providers";
import {ErrorProvider} from "../../providers/error/error";
import {UsuarioProvider} from "../../providers/usuario/usuario";

/**
 * Generated class for the VentaFinalizadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-venta-finalizada',
  templateUrl: 'venta-finalizada.html',
})
export class VentaFinalizadaPage {

  //Eventos
  static readonly EVENT_VENTA_FINALIZADA: string = 'VentaFinalizadaPage:ventaFinalizada';
  static readonly EVENT_NUEVA_VENTA: string = 'IngresoPuntoVentaPage';

  userInfo: any;
  ventaReservada: any;

  constructor(public navCtrl: NavController,
              public error: ErrorProvider,
              public events: Events,
              public usuario: UsuarioProvider,
              public timer: TimerProvider,
              private venta: VentaProvider) {

    this.userInfo = this.usuario.getUser();

    this.ventaReservada = this.venta.getVentaReservada();
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
  }

  ionViewDidEnter() {
    this.timer.finalizarTimer();
    this.events.publish(VentaFinalizadaPage.EVENT_VENTA_FINALIZADA);
  }

  confirmarClicked() {
    this.venta.reset(true);
    this.events.publish(VentaFinalizadaPage.EVENT_NUEVA_VENTA);
  }

  esVentaConTarjeta() {

    let esVentaConTarjeta = false;

    if(this.ventaReservada && this.ventaReservada.operacion.operacion_medios_pago[0].operacion_medio_pago_autorizacion) {
      esVentaConTarjeta = true;
    }
    return esVentaConTarjeta;
  }

}
