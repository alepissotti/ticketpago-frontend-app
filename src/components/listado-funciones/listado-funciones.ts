import {Component, Input} from '@angular/core';
import {Events, NavController, Loading} from "ionic-angular";
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {ErrorProvider} from "../../providers/error/error";

/**
 * Generated class for the ListadoFuncionesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'listado-funciones',
  templateUrl: 'listado-funciones.html'
})
export class ListadoFuncionesComponent {

  static readonly EVENT_CLICK_CANCELAR: string = 'listadoFunciones:clickCancelar';
  static readonly EVENT_FUNCION_ELEGIDA: string = 'listadoFunciones:funcionElegida';
  static readonly EVENT_UPDATE_FUNCIONES: string = 'listadoFunciones:updateFunciones';

  @Input() funciones: any;
  @Input() funcionesMessage: any;
  @Input() loading: any;

  constructor(private events: Events,
              public usuario: UsuarioProvider,
              public navCtrl: NavController,
              public error: ErrorProvider) {
  }

  ceil(n: number) {
    return Math.ceil(n);
  }

  updateClicked() {
    this.events.publish(ListadoFuncionesComponent.EVENT_UPDATE_FUNCIONES);
  }

  funcionClicked(funcion) {
    this.events.publish(ListadoFuncionesComponent.EVENT_FUNCION_ELEGIDA, funcion);
  }

  cancelarClicked = () => {
    this.events.publish(ListadoFuncionesComponent.EVENT_CLICK_CANCELAR);
  }

}
