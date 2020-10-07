import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";
import { MensajeProvider } from '../../../providers/mensaje/mensaje';

@Injectable()
export class TimerProvider { 

  static readonly EVENT_TIME_FINISHED: string = 'TimeProvider:timeFinished';

  public activo: boolean;
  public cancelando: boolean = false;

  public minutos: any = null;
  public segundos: any = null;

  tiempoRestante: any;

  constructor(private mensaje: MensajeProvider,
              public events: Events ) {
      this.minutos = null;
      this.segundos = null;
      this.activo = false;
  }

  inicializar(tiempoRestante) {
      if(!this.activo) {
        this.minutos = null;
        this.segundos = null;
        this.activo = true;
        this.cancelando = false;
        this.tiempoRestante = tiempoRestante;
        this.checkTime();
      }
      
  }

    /**
   *
   * @param tiempoRestante -> string "MM:SS"
   */
  checkTime = () => {
    
    if(this.minutos == null && this.segundos == null && typeof this.tiempoRestante === "string") {

      let time = this.tiempoRestante.split(':');
      this.minutos = +time[0];
      this.segundos = +time[1];
    }

    setTimeout(() => {
      if(this.segundos == 0 && this.minutos == 0) {
        return;
      }

      if(this.segundos == 0) {
        this.minutos--;
        this.segundos = 59;
      } else {
        this.segundos--;
      }

      if(this.activo && this.minutos == 0 && this.segundos == 0) {
        this.cancelando = true;
        this.mensaje.presentar(
            'Tiempo de compra superado',
            'Su tiempo asignado para la compra de las ubicaciones elegidas a expirado. Intente nuevamente!',
          { buttons: [{
              text: 'Ok',
              handler: () => {
                this.events.publish(TimerProvider.EVENT_TIME_FINISHED);
              }
            }
            ]}
          );

      } else {
        if(!this.cancelando) {
          this.checkTime();
        }
      }

    }, 1000 );
  }

  finalizarTimer() {
    this.activo = false;
    this.cancelando = true;
  }
}