import { CARTELERA_PAGE } from './../pages';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DefensaConsumidorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: [CARTELERA_PAGE]
})
@Component({
  selector: 'page-defensa-consumidor',
  templateUrl: 'defensa-consumidor.html',
})
export class DefensaConsumidorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
