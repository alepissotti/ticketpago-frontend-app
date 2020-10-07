import {Component, forwardRef} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import { SearchableEntityComponent } from '../../app/shared/components/searchable-entity/searchable-entity';
import {FormBuilder,ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { SearchableLoteOperacionEnvioEstadoProvider } from '../../providers/searchable-lote-operacion-envio-estado/searchable-lote-operacion-envio-estado';


export const CUSTOM_SEARCHABLE_LOTE_OPERACION_ENVIO_ESTADO_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchableLoteOperacionEnvioEstadoComponent),
  multi: true
};

/**
 * Generated class for the SearchableEspectaculoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-lote-operacion-envio-estado',
  templateUrl: '../../app/shared/components/searchable-entity/searchable-entity.html',
  providers: [CUSTOM_SEARCHABLE_LOTE_OPERACION_ENVIO_ESTADO_COMPONENT_ACCESSOR],
  inputs: ['label']
})
export class SearchableLoteOperacionEnvioEstadoComponent extends SearchableEntityComponent implements ControlValueAccessor{

  static readonly ADDITIONAL_CRITERIA_PUNTO_VENTA_ID: number = 1;
  
  constructor(public events: Events,
              protected searchableLoteOperacionEnvioEstadoProvider: SearchableLoteOperacionEnvioEstadoProvider,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    super(events, searchableLoteOperacionEnvioEstadoProvider, modalCtrl, formBuilder, loadingCtrl, alertCtrl);

    
  }

  setPuntoVenta(puntoVenta) {
    let value = null;
    if(puntoVenta) {
      value = puntoVenta.id
    }

    console.log('buscando punto de venta con espectaculos activos');

    this.addAdditionalCriteria(SearchableLoteOperacionEnvioEstadoComponent.ADDITIONAL_CRITERIA_PUNTO_VENTA_ID, value);
  }
}
