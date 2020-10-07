import {Component, forwardRef} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import { SearchableEntityComponent } from '../../app/shared/components/searchable-entity/searchable-entity';
import {FormBuilder,ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { SearchableFuncionProvider } from './../../providers/searchable-funcion/searchable-funcion';


export const CUSTOM_SEARCHABLE_FUNCION_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchableFuncionComponent),
  multi: true
};

/**
 * Generated class for the SearchableFuncionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-funcion',
  templateUrl: '../../app/shared/components/searchable-entity/searchable-entity.html',
  providers: [CUSTOM_SEARCHABLE_FUNCION_COMPONENT_ACCESSOR],
  inputs: ['label']
})
export class SearchableFuncionComponent extends SearchableEntityComponent implements ControlValueAccessor{

  static readonly ADDITIONAL_CRITERIA_ESPECTACULO_ID: number = 1;
  static readonly ADDITIONAL_CRITERIA_SOLO_FUNCIONES_ACTIVAS_ID: number = 2;
  
  constructor(public events: Events,
              protected searchableFuncionProvider: SearchableFuncionProvider,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    super(events, searchableFuncionProvider, modalCtrl, formBuilder, loadingCtrl, alertCtrl);
  }

  setEspectaculo(espectaculo) {

    let value = null;
    if(espectaculo) {
      value = espectaculo.id
    }

    this.addAdditionalCriteria(SearchableFuncionComponent.ADDITIONAL_CRITERIA_ESPECTACULO_ID, value);

  }

  setSoloFuncionesActivas() {
    this.addAdditionalCriteria(SearchableFuncionComponent.ADDITIONAL_CRITERIA_SOLO_FUNCIONES_ACTIVAS_ID, true);
  }
  

}
