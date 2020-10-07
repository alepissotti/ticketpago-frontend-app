import {Component} from '@angular/core';
import { IonicPage  ,NavController , NavParams} from 'ionic-angular';
import {VentaProvider,UsuarioProvider} from '../../providers/providers';





@IonicPage()
@Component({
  selector: 'modal-devoluciones',
  templateUrl: 'modal-devoluciones.html'
})

export class ModalDevolucionesPage {


autorizacion : any;
devoluciones : any;


constructor(private navParms : NavParams,
            private navCtrl : NavController,
            private venta : VentaProvider,
            private usuario : UsuarioProvider,
            ) {

      this.autorizacion = this.navParms.get('autorizacion');
      this.devoluciones = this.autorizacion.operacion_medio_pago_devoluciones;        
  
}

  ionViewDidLoad() {

  }

  salirClicked() {
    this.navCtrl.pop();
  }

  reimprimirComprobante(operacionMedioPagoDevolucionId) {
    this.venta.imprimirComprobanteDevolucionesGet(this.usuario,{'operacionMedioPagoDevolucionId' : operacionMedioPagoDevolucionId})
  }


}