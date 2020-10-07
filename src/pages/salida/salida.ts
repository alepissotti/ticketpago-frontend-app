import { Component } from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'salida',
  templateUrl: 'salida.html'
})
export class SalidaPage {

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController) {

  }

}
