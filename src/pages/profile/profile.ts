import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public usuarioProvider: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.user = this.usuarioProvider.getUser();
    
  }

}
