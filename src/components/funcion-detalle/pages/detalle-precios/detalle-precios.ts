import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage({
})
@Component({
  selector: 'detalle-precios',
  templateUrl: 'detalle-precios.html',
})
export class DetallePreciosPage {

  espectaculo: any;
  funcion: any;

  constructor(private navCtrl: NavController,
              public navParams: NavParams) {

    this.espectaculo = this.navParams.get('espectaculo');
    this.funcion = this.navParams.get('funcion');

  }

  ionViewDidLoad() {
  }

  ionViewWillLeave() {
  }

  cerrar() {
    this.navCtrl.pop();
  }

}
