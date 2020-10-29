import {Component} from '@angular/core';
import { IonicPage , NavController, NavParams, ModalController} from 'ionic-angular';
import {MODAL_LISTADO_OPERAIONES_PAGE} from '../pages';


@IonicPage()
@Component({
    selector : 'listado-consulta-operaciones',
    templateUrl : 'listado-consulta-operaciones.html',
})

export class ListadoConsultaOperacionesPage {

    operaciones : any;
    busquedaPorFecha : boolean;

    constructor(public navParams : NavParams,
                public navCtrl : NavController,
                public modalCtrl : ModalController,
               ) 
    {
        this.operaciones = this.navParams.get('operaciones');
        this.busquedaPorFecha = this.navParams.get('busquedaPorFecha') ?this.navParams.get('busquedaPorFecha') :false;
    }

    salirClicked() {
        this.navCtrl.pop();   
    }

    verDetallesOperacion(operacion : any) {
        
        this.navCtrl.push(MODAL_LISTADO_OPERAIONES_PAGE, {
            operacion : operacion,
            busquedaPorFecha : this.busquedaPorFecha
        })
    
    } 
}