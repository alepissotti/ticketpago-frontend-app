import {Component, forwardRef} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import { SearchableEntityComponent } from '../../app/shared/components/searchable-entity/searchable-entity';
import {FormBuilder,ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { SearchablePuntoVentaProvider } from '../../providers/searchable-punto-venta/searchable-punto-venta';


export const CUSTOM_SEARCHABLE_PUNTO_VENTA_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchablePuntoVentaComponent),
  multi: true
};

/**
 * Generated class for the SearchableFuncionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-punto-venta',
  templateUrl: '../../app/shared/components/searchable-entity/searchable-entity.html',
  providers: [CUSTOM_SEARCHABLE_PUNTO_VENTA_COMPONENT_ACCESSOR],
  inputs: ['label']
})
export class SearchablePuntoVentaComponent extends SearchableEntityComponent implements ControlValueAccessor{
  
  constructor(public events: Events,
              protected searchablePuntoVentaProvider: SearchablePuntoVentaProvider,
              public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    super(events, searchablePuntoVentaProvider, modalCtrl, formBuilder, loadingCtrl, alertCtrl);
  }
  

}
