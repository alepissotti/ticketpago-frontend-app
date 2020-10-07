import { CARTELERA_PAGE } from './../pages';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PoliticasPrivacidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: [CARTELERA_PAGE]
})
@Component({
  selector: 'page-politicas-privacidad',
  templateUrl: 'politicas-privacidad.html',
})
export class PoliticasPrivacidadPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
