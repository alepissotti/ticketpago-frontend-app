import {Component, Input} from '@angular/core';
import {Events, NavController} from "ionic-angular";
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {ErrorProvider} from "../../providers/error/error";

/**
 * Generated class for the ListadoFuncionesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'listado-funcion-sectores',
  templateUrl: 'listado-funcion-sectores.html',

})
export class ListadoFuncionSectoresComponent {

  static readonly EVENT_CLICK_CANCELAR: string = 'listadoFuncionSectores:clickCancelar';
  static readonly EVENT_FUNCION_SECTOR_ELEGIDO: string = 'listadoFuncionSectores:funcionSectorElegido';
  static readonly EVENT_UPDATE_FUNCION_SECTORES: string = 'listadoFuncionSectores:updateFuncionSectores';

  @Input() funcionSectores: any;
  @Input() funcionSectoresMessage: any;
  @Input() loading: any;

  planoConfiguracionId: number;

  constructor(private events: Events,
              public usuario: UsuarioProvider,
              public navCtrl: NavController,
              public error: ErrorProvider) {
  }

  ceil(n: number) {
    return Math.ceil(n);
  }

  updateClicked() {
    this.events.publish(ListadoFuncionSectoresComponent.EVENT_UPDATE_FUNCION_SECTORES);
  }

  funcionSectorClicked(funcionSector) {
    this.events.publish(ListadoFuncionSectoresComponent.EVENT_FUNCION_SECTOR_ELEGIDO, funcionSector);
  }

  mouseEnter(planoConfiguracionId) {
    this.planoConfiguracionId = planoConfiguracionId;
  }

  mouseLeave() {
    this.planoConfiguracionId = null;
  }

  cancelarClicked = () => {
    this.events.publish(ListadoFuncionSectoresComponent.EVENT_CLICK_CANCELAR);
  }

}
