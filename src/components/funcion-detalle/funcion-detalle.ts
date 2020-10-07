import { ModalController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the FuncionDetalleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'funcion-detalle',
  templateUrl: 'funcion-detalle.html'
})
export class FuncionDetalleComponent {

  @Input() espectaculo: any;
  @Input() muestra_detalle_cancelacion: boolean = false;

  constructor(private modalCtrl: ModalController) {
  }

  verPrecios(funcion) {
    console.log(this.espectaculo);
    let modalPrecios = this.modalCtrl.create('DetallePreciosPage', {espectaculo: this.espectaculo, funcion: funcion});
    modalPrecios.present();
  }

}
