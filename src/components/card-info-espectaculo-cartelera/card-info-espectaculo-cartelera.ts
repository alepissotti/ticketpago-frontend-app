import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Events} from "ionic-angular";

/**
 * Generated class for the InfoEspectaculoCarteleraComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'card-info-espectaculo-cartelera',
  templateUrl: 'card-info-espectaculo-cartelera.html'
})
export class CardInfoEspectaculoCarteleraComponent {

  @Input() espectaculo: any;
  @Output() protected selected = new EventEmitter<any>();

  static readonly EVENT_ESPECTACULO_CARTELERA_MAS_INFORMACION: string = 'infoEspectaculoCartelera:masInformacion';

  constructor(public events: Events) {
  }

  getInformacion(espectaculo) {
    this.selected.emit({
      espectaculo: espectaculo
    });
  }

}
