import { CARTELERA_PAGE } from './../pages';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TerminosCondicionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: [CARTELERA_PAGE]
})
@Component({
  selector: 'page-terminos-condiciones',
  templateUrl: 'terminos-condiciones.html',
})
export class TerminosCondicionesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
