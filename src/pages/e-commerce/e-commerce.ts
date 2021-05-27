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


  datosEnviados: any;
  envioDatos : boolean;


    constructor(public navCtrl : NavController) {             
        this.envioDatos = false;
        this.obtenerParametros();
        this.enviarDatos();
                    
    }

    ionViewDidLoad() {
        
    }

    obtenerParametros() {
        const numberSplit = (window.location.href.includes('localhost') ) ?3 :5;
        const data = atob(window.location.href.replace(window.location.origin,'').split('/')[numberSplit]);
        this.datosEnviados = (!data) ?null :JSON.parse(data);
    }

    enviarDatos() {
        this.navCtrl.push(TICKET_PAGO_PAGE,{
            datos: this.datosEnviados
        }) .then(() => {
            this.envioDatos = true;
        })
    }

    ionViewDidEnter() {
        if (this.envioDatos) {
        window.history.go(-1);
        }
    }



    
}