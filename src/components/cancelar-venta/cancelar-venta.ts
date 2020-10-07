import { CARTELERA_PAGE, INGRESO_PUNTO_VENTA_PAGE} from './../../pages/pages';
import {Component, EventEmitter, Output} from '@angular/core';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {Events, NavController, AlertController} from "ionic-angular";
import {UsuarioProvider} from "../../providers/usuario/usuario";

@Component({
  selector: 'cancelar-venta',
  templateUrl: 'cancelar-venta.html',
  inputs: ['ventaReservada']
})
export class CancelarVentaComponent {

  @Output() estado = new EventEmitter<any>();

  constructor(private venta: VentaProvider,
              private usuario: UsuarioProvider,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private events: Events,
              private error: ErrorProvider) {
  }

  cancelarClicked = () => {
    let alert = this.alertCtrl.create({
      title: 'Cancelar operación',
      subTitle: 'Está seguro de cancelar la operación?',
      buttons: [
        {text: 'Cancelar' , handler : () => {} },
        {text: 'Aceptar', handler: () => {this.cancelarVenta()} }
      ]
    })

    alert.present();
  }

  cancelarVenta() {
    if(this.venta) {
      this.venta.reset().catch(error => {
        error.logLevel = 'error';
        this.error.handle(error);
      });
      this.estado.emit({cancelado: true});
    }

    if(this.usuario.isPuntoDeVentaOnline()) {
      if(this.navCtrl.getActive().name != INGRESO_PUNTO_VENTA_PAGE) {
        this.navCtrl.pop().catch(error => {
          this.error.handle({error: error, logLevel: 'error'});
        });
      }
    } else {
      this.navCtrl.pop().then(() => {
      }).catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      });
    }
  }

}
