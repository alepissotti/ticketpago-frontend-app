import { ReporteProvider } from './../../providers/reporte/reporte';
import {Component, ViewChild} from '@angular/core';
import {Events, NavController} from "ionic-angular";
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {ErrorProvider} from "../../providers/error/error";
import {CARTELERA_PAGE, INGRESO_PUNTO_VENTA_PAGE} from "../../pages/pages";

/**
 * Generated class for the ListadoEspectaculosDisponiblesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'listado-espectaculos-disponibles',
  templateUrl: 'listado-espectaculos-disponibles.html',
  inputs: ['espectaculos','loading','titulo'],

})
export class ListadoEspectaculosDisponiblesComponent {

  static readonly EVENT_ESPECTACULO_ELEGIDO: string = 'listadoEspectaculosDisponibles:espectaculoElegido';
  static readonly EVENT_UPDATE_ESPECTACULOS: string = 'listadoEspectaculosDisponibles:updateEspectaculos';

  @ViewChild('buscadorEspectaculos') buscadorEspectaculos;

  busqueda: string;


  constructor(private events: Events,
              public usuario: UsuarioProvider,
              public reporteProvider: ReporteProvider,
              public navCtrl: NavController,
              public error: ErrorProvider) {
    setTimeout(() => {
      //this.buscadorEspectaculos.setFocus();
    }, 500);
  }

  mostrarDisponibilidad(espectaculo) {
    return !espectaculo.articulo_id;
  }

  ceil(n: number) {
    return Math.ceil(n);
  }

  updateClicked() {
    this.events.publish(ListadoEspectaculosDisponiblesComponent.EVENT_UPDATE_ESPECTACULOS);
  }

  espectaculoClicked(espectaculo) {
    let articuloId = espectaculo.articulo_id; //Id del espectaculo en sistema mostrador
    if(articuloId) {
      //Se determina que tipo de usuario es el que esta comprando la entrada
      this.reporteProvider.ventaEntradaSistemaMostrador({'espectaculoId': espectaculo.id});

    } else {
      this.events.publish(ListadoEspectaculosDisponiblesComponent.EVENT_ESPECTACULO_ELEGIDO, espectaculo);
    }
  }

  cancelarClicked = () => {

    if(this.usuario.isPuntoDeVentaOnline()) {
      this.navCtrl.setRoot(CARTELERA_PAGE).catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      });
    } else {
      this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE).catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      });
    }
  }

}
