import { SearchableEspectaculoProvider } from './../../providers/searchable-espectaculo/searchable-espectaculo';
import {Component, forwardRef} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import { SearchableEntityComponent } from '../../app/shared/components/searchable-entity/searchable-entity';
import {FormBuilder,ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


export const CUSTOM_SEARCHABLE_ESPECTACULO_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchableEspectaculoComponent),
  multi: true
};

/**
 * Generated class for the SearchableEspectaculoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-espectaculo',
  templateUrl: '../../app/shared/components/searchable-entity/searchable-entity.html',
  providers: [CUSTOM_SEARCHABLE_ESPECTACULO_COMPONENT_ACCESSOR],
  inputs: ['label']
})
export class SearchableEspectaculoComponent extends SearchableEntityComponent implements ControlValueAccessor{

  static readonly ADDITIONAL_CRITERIA_PUNTO_VENTA_ID: number = 1;
  static readonly ADDITIONAL_CRITERIA_PUNTO_VENTA_Y_ACTIVOS_ID: number = 2;

  constructor(public events: Events,
              protected searchableEspectaculoProvider: SearchableEspectaculoProvider,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    super(events, searchableEspectaculoProvider, modalCtrl, formBuilder, loadingCtrl, alertCtrl);
  }

  setPuntoVenta(puntoVenta) {

    let value = null;
    if(puntoVenta) {
      value = puntoVenta.id
    }

    this.addAdditionalCriteria(SearchableEspectaculoComponent.ADDITIONAL_CRITERIA_PUNTO_VENTA_ID, value);

  }

  setPuntoVentaYActivos(puntoVenta) {
    let value = null;
    if(puntoVenta) {
      value = puntoVenta.id
    }

    console.log('buscando punto de venta con espectaculos activos');

    this.addAdditionalCriteria(SearchableEspectaculoComponent.ADDITIONAL_CRITERIA_PUNTO_VENTA_Y_ACTIVOS_ID, value);
  }

  // removeAdditionalCriteria(id)

}
