import {Component} from '@angular/core';
import { IonicPage, NavController , ViewController } from 'ionic-angular';
import {LINK_TICKET_PAGO_PAGE} from '../pages';



@IonicPage({
    name : 'link-pago',
    segment : 'link-pago/:params',
})
@Component({
  selector: 'link-pago',
  templateUrl: 'link-pago.html'
},
)

export class LinkPagoPage {

    params : any;
    operacionId : number;
    usernameLogin : string;
    passwordLogin : string;
    envioDatos : boolean;



    constructor(public navCtrl : NavController,
                public viewCtrl : ViewController,
                ) {             
                    
        this.envioDatos = false;
        this.obtenerParametros();
        this.enviarDatos();
                    
                    
    }

    ionViewDidLoad() {

    }

   obtenerParametros() {
        this.params = atob(window.location.href.replace(window.location.origin,'').split('/')[5]);
        this.operacionId = parseInt(this.params.split('->')[0]);
        this.usernameLogin = this.params.split('->')[1];
        this.passwordLogin = this.params.split('->')[2];
    }

    enviarDatos() {
        
        this.navCtrl.push(LINK_TICKET_PAGO_PAGE,{
            usernameLogin : this.usernameLogin,
            passwordLogin : this.passwordLogin,
            operacionId : this.operacionId,
            finalizada : false,
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