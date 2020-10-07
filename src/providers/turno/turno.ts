import {AlertController, Alert} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api/api";
import { IfObservable } from 'rxjs/observable/IfObservable';

@Injectable()
export class TurnoProvider {

  turno: any;

  alert: Alert;
  seguirSondeando: boolean;

  constructor(public api: ApiProvider,
              public alertCtrl: AlertController,) {
    this.turno = {};
    this.alert = null
    this.seguirSondeando = true;
  }

  consultarTurno(espectaculo): Promise<any> {
    
    this.seguirSondeando = true;
    return this.realizarConsulta(espectaculo);
  }

  private realizarConsulta(espectaculo): Promise<any> {
    return  new Promise((resolve, reject) => {
      //validar el turno del usuario para poder comprar
      if(this.seguirSondeando) {
        if(!this.alert) {
          this.alert = this.alertCtrl.create({
            title: "Fila de espera",
            message: "Estamos verificando la disponibilidad de ubicaciones para una mejor experiencia de compra, gracias",
            buttons: [{
              text: 'Cancelar ',
              handler: () => {
                this.seguirSondeando = false;
                this.alert = null;
                //resolve(null);
              }}],
            cssClass: 'alert-turno',
            enableBackdropDismiss: false
          });
          this.alert.present();
        }
      
        this.api.postToUrlBackend("turnos",{'espectaculo': espectaculo}).then(response => {
          this.turno = response.data;

          if(this.isTurnoActivo()) {
            this.alert.dismiss();
            this.alert = null;
            resolve(response.data);
          } else {
            this.setLoadingMessage();
            
            setTimeout(() => {
              this.realizarConsulta(espectaculo).then(response => {
                resolve(response);
              }).catch( error => {
                reject(error);
              });
            }, this.getTiempoSondeo());
          }  
            
        }).catch(error => {
          if(this.alert) {
          this.alert.dismiss();
          this.alert = null;
          }
          reject(error);
        })
      }
    })
  }

  setLoadingMessage() {
      if (this.turno.turno_faltantes > 20) {
        this.setLoadingText(`Debido a la gran concurrencia y para lograr una mejor experiencia de compra
                            en estos momentos hay ${this.turno.turnos_faltantes} personas esperando para comprar.`);
      } else {
      if (this.turno.turnos_faltantes > 0) {
        this.setLoadingText(`Aguarde unos instantes para tener una mejor experiencia de compra, 
                            en estos momentos hay ${this.turno.turnos_faltantes} personas esperando para comprar.`);
      } else {
        this.setLoadingText(`Aguarde unos instantes, estamos preparando su compra. <br/>Gracias por esperarnos!`);
      }
    }
    
  }

  setLoadingText(text:string) {

    let alertText =  `${text}`;//<br/>Turnos Pendientes: ${this.turno.turnos_faltantes}`;
    this.alert? this.alert.setMessage(alertText): null;
  }

  isTurnoActivo() {
    return this.turno.activo;
  }

  getTiempoSondeo() {
      return 20000;
  }

  cancelarTurno(espectaculoId) {
    this.api.postToUrlBackend("finalizarturnos",{'espectaculo': espectaculoId}).then(response => {
      this.turno = response.data;
      console.log('se cancelo el turno');
    }).catch(error => {
      if(this.alert) {
      this.alert.dismiss();
      this.alert = null;
      }
    })
  }

}