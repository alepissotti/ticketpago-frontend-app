import { ApiProvider } from './../../providers/api/api';
import { DEFENSA_CONSUMIDOR_PAGE, POLITICAS_PRIVACIDAD_PAGE, TERMINOS_CONDICIONES_PAGE } from './../../pages/pages';
import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import { CarteleraProvider } from '../../providers/providers';

@Component({
  selector: 'common-page-footer',
  templateUrl: 'common-page-footer.html'
})
export class CommonPageFooter {

  constructor(private navCtrl: NavController,
              private cartelera: CarteleraProvider,
              private api: ApiProvider) {
  }
  
  goTerminosCondiciones() {
    this.navCtrl.push(TERMINOS_CONDICIONES_PAGE);
  }
  
  goPoliticasPrivacidad() {
    this.navCtrl.push(POLITICAS_PRIVACIDAD_PAGE);
  }
  
  goDefensaConsumidor() {
    this.navCtrl.push(DEFENSA_CONSUMIDOR_PAGE);
  }
  
  openURL(url){
    window.open(url,'_blank',"location=yes");
  };

}
