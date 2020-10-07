import {Component} from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import {TICKET_PAGO_PAGE} from '../pages';



@IonicPage({
    name : 'e-commerce',
    segment : 'e-commerce/:params',
})
@Component({
  selector: 'e-commerce',
  templateUrl: 'e-commerce.html'
},
)

export class EcommercePage {


  params : any;
  usernameLogin : string;
  passwordLogin : string;
  espectaculoId : number;
  transaccionTerceroId : number;
  urlEcommerce : string;
  total : number;
  envioDatos : boolean;


    constructor(public navCtrl : NavController) {             
        this.envioDatos = false;
        this.obtenerParametros();
        this.enviarDatos();
                    
    }

    ionViewDidLoad() {
        
    }

    obtenerParametros() {
        this.params = atob(window.location.href.replace(window.location.origin,'').split('/')[3]);
        this.usernameLogin = this.params.split('->')[0];
        this.passwordLogin = this.params.split('->')[1];
        this.espectaculoId = parseFloat(this.params.split('->')[2]);
        this.transaccionTerceroId = parseFloat(this.params.split('->')[3]);
        this.urlEcommerce = this.params.split('->')[4];
        this.total = parseFloat(this.params.split('->')[5]);
        

    }

    enviarDatos() {
        this.navCtrl.push(TICKET_PAGO_PAGE,{
            usernameLogin : this.usernameLogin,
            passwordLogin : this.passwordLogin,
            espectaculoId : this.espectaculoId,
            transaccionTerceroId : this.transaccionTerceroId,
            urlEcommerce : this.urlEcommerce,
            total : this.total
        }).then(() => {
            this.envioDatos = true;
        })
    }

    ionViewDidEnter() {
        if (this.envioDatos) {
        window.history.go(-1);
        }
    }



    
}