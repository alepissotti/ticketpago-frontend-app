import {Component, ViewChild} from '@angular/core';
import { IonicPage , LoadingController ,NavController , ViewController , NavParams, AlertController} from 'ionic-angular';
import {ErrorProvider, VentaProvider , UsuarioProvider , MensajeProvider} from "../../providers/providers";




@IonicPage()
@Component({
  selector: 'modal-listado-operaciones',
  templateUrl: 'modal-listado-operaciones.html'
})

export class ModalListadoOperacionesPage {

  operacion : any;
  busquedaPorfecha : boolean;

  constructor(public navParms : NavParams,
              public navCtrl : NavController,
             ) 
  {
    this.operacion = this.navParms.get('operacion');
    this.busquedaPorfecha = this.navParms.get('busquedaPorFecha');
  }

  volver() {
    this.navCtrl.pop();
  }
}