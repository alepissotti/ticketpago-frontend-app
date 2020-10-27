import {Component} from '@angular/core';
import { IonicPage , NavController, NavParams} from 'ionic-angular';


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

               ) 
    {
        this.operaciones = this.navParams.get('operaciones');
        this.busquedaPorFecha = this.navParams.get('busquedaPorFecha') ?this.navParams.get('busquedaPorFecha') :false;
    }

    salirClicked() {
        this.navCtrl.pop();   
    }
}