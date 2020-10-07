import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AlertController, ToastController} from "ionic-angular";

/*
  Generated class for the MensajeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MensajeProvider {

  constructor(private alertCtrl: AlertController,
              private toastCtrl: ToastController
              ) {
  }

  presentar(titulo = null, mensaje, opciones = null, tiempoDuracion = null) {
    if(!tiempoDuracion) {
      let alert = this.alertCtrl.create({
        title: titulo,
        message: mensaje,
        enableBackdropDismiss: false,
        inputs: opciones? opciones.inputs : null,
        buttons: opciones? opciones.buttons : null,
      });
      alert.present();
    } else {
      this.toastCtrl.create(
        {
          message: mensaje,
          duration: tiempoDuracion,
          position: 'middle',
          showCloseButton: false,
          closeButtonText: 'X'
        }).present().catch(error => {
          console.error('[Toast]: ', error);
        }
      )
    }
  }

}
