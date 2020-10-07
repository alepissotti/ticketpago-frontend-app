import { CARTELERA_PAGE } from "../pages";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'token-usado',
  templateUrl: 'token-usado.html'
})
export class TokenUsadoPage {

  @ViewChild('usernameInput') usernameInput;

  constructor(private navCtrl: NavController) {
  }

  goCartelera() {
    this.navCtrl.setRoot(CARTELERA_PAGE);
  }

}
