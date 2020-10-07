import {Component, forwardRef} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import { SearchableEntityComponent } from '../../app/shared/components/searchable-entity/searchable-entity';
import {FormBuilder,ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { SearchableTipoEnvioProvider } from '../../providers/providers';


export const CUSTOM_SEARCHABLE_TIPO_ENVIO_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchableTipoEnvioComponent),
  multi: true
};

/**
 * Generated class for the SearchableFuncionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-tipo-envio',
  templateUrl: '../../app/shared/components/searchable-entity/searchable-entity.html',
  providers: [CUSTOM_SEARCHABLE_TIPO_ENVIO_COMPONENT_ACCESSOR],
  inputs: ['label']
})
export class SearchableTipoEnvioComponent extends SearchableEntityComponent implements ControlValueAccessor{
  
  constructor(public events: Events,
              protected searchableTipoEnvioProvider: SearchableTipoEnvioProvider,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    super(events, searchableTipoEnvioProvider, modalCtrl, formBuilder, loadingCtrl, alertCtrl);
  }

}
