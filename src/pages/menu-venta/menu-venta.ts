import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ErrorProvider, UsuarioProvider, VentaProvider} from "../../providers/providers";
import {
  CLIENTES_PAGE, ESPECTACULOS_DISPONIBLES_PAGE, MEDIOS_DE_PAGO_PAGE, PUNTOS_DE_VENTA_PAGE,
  VENTA_PAGE
} from "../pages";

@IonicPage({
  defaultHistory: [ESPECTACULOS_DISPONIBLES_PAGE, VENTA_PAGE]
})
@Component({
  selector: 'page-menu-venta',
  templateUrl: 'menu-venta.html',
})
export class MenuVentaPage {
  ventaReservada: any;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              private user: UsuarioProvider,
              private venta: VentaProvider) {
    this.ventaReservada = this.venta.getVentaReservada();
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
  }

  ionViewCanEnter() {
    if(!this.user.puedeReservarOPreimprimir()) {
      this.finalizarVentaClicked();
    }
  }

  finalizarVentaClicked() {
    this.navCtrl.push(MEDIOS_DE_PAGO_PAGE);
  }

  preimpresionClicked() {
    this.navCtrl.push(PUNTOS_DE_VENTA_PAGE);
  }

  reservaClicked() {
    this.navCtrl.push(CLIENTES_PAGE);
  }

  cancelarClicked() {
    this.venta.reset();
    this.navCtrl.setRoot(ESPECTACULOS_DISPONIBLES_PAGE).catch(error => {
      this.error.handle({error: error, logLevel: 'error'});
    });
  }

}
