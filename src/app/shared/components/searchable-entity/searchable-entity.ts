import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {Component, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {AlertController, Events, LoadingController, ModalController} from "ionic-angular";
import {SearchableEntityProvider} from "../../providers/searchable-entity/searchable-entity";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {};

export const CUSTOM_SEARCHABLE_ENTITY_COMPONENT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchableEntityComponent),
  multi: true
};

/**
 * Generated class for the SearchableEntityComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'searchable-entity',
  templateUrl: 'searchable-entity.html',
  providers: [SearchableEntityProvider, CUSTOM_SEARCHABLE_ENTITY_COMPONENT_ACCESSOR]
})
export class SearchableEntityComponent implements ControlValueAccessor {

  static readonly EVENT_SEARCHABLE_ENTITY_ON_SEARCH_END: string = 'searchableEntityComponent:onSearchEnd';
  static readonly EVENT_SEARCHABLE_ENTITY_ON_SEARCH_INIT: string = 'searchableEntityComponent:onSearchInit';

  detalle: string;
  idRepresentado: string;
  buttonIconName: string;

  inicioBusqueda: boolean = false;
  searchableEntity: any;
  additionalCriterias: any = [];

  protected SearchableForm: any;

  @Input() label: string = null;
  @Input() protected required: boolean = false;
  @Output() protected update = new EventEmitter<any>();

  @ViewChild('idInput') idInput;

  validation_messages: any; 

  @Input() canCreateEntity: false; //Define si se pueden dar de alta entidades desde el buscador
  @Input() canEdit: false; //Define si es posible editar datos de la entidad desde el buscador

  protected createPage: any = null;

  constructor(public events: Events,
              protected searchableEntityProvider: SearchableEntityProvider,
              protected modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              protected alertCtrl: AlertController) {

    this.buttonIconName = "search";
    this.createPage = this.getCreatePage();
    this.inicializar();
  }

  ngOnInit() {
    this.validation_messages = {
      id: [
        { type: 'required', message: 'Es obligatorio insertar el valor para el buscador: "'+ this.label + '"'}
      ]
    }

    /**
     * Si el buscador es obligatorio agregamos su validación correspondiente
     */
    if(this.required) {
      this.SearchableForm = this.formBuilder.group({
        id: ['', Validators.compose([Validators.required])]
      });
    } else {
      this.SearchableForm = this.formBuilder.group({
        id: ['']
      });
    }
  }

  /**
   * Función para ser redefinida en clases hijas y que determina cual es la página que sirve para crear otras entidades del buscador.
   */
  protected getCreatePage() {
    return null;
  }

  getForm() {
    return this.SearchableForm;
  }

  focusOnIdInput() {
    this.idInput.setFocus();
  }

  inicializar() {
    this.setSearchableEntity(null);
  }

  showCriteriaSearch() {
    this.searchableEntityProvider.searchableCriteria().then( (response) => {

      let searchableCriterias = response["searchable_criteria"];
      let criteriaSearchModal = this.modalCtrl.create(
        'SearchableEntityCriteriaPage',
        { searchableCriterias: searchableCriterias,
          searchableEntityProvider: this.searchableEntityProvider,
          additionalCriterias: this.additionalCriterias,
          createPage: this.createPage  });
      criteriaSearchModal.onDidDismiss(data => {
        if (data) {
          this.setSearchableEntity(data);
        }
        this.focusOnInput();
      });
      criteriaSearchModal.present().catch(error => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error al intentar mostrar los criterios de busqueda',
          buttons: [{
            text: 'Continuar',
            handler: () => {
              this.focusOnInput();
            }
          }]
        });
        alert.present();
      });
    });
  }

  get id(): string {
    let id:any = null;
    if (this.searchableEntity) {
      id = this.searchableEntity.id;
    }
    return id;
  }

  protected setSearchableEntity(searchableEntity:any) {
    this.searchableEntity = searchableEntity;
    this.showSearchableEntity();
    this.onChangeCallback(searchableEntity);
  }

  public getSearchableEntity() {
    return this.searchableEntity;
  }

  private showSearchableEntity() {
    let searchableEntity = this.getSearchableEntity();

    if (searchableEntity) {
      this.detalle = searchableEntity.detalle;
      this.idRepresentado = searchableEntity.id_representado;
    } else {
      this.detalle = '';
      this.idRepresentado = null;
    }

    this.updateEntity();
  }

  updateEntity() {
    this.update.emit({
      searchableEntity: this.getSearchableEntity()
    });
  }

  getSearchedValue() {
    return this.idRepresentado;
  }


  isEmptySearchableValue() {
    return this.getSearchedValue() == null || this.getSearchedValue() == '';
  }

  verifySearch() {
    let valido = true;

    if(this.isEmptySearchableValue()) {

      valido = false;
    } else {
      if(this.searchableEntity && this.getSearchedValue() == this.searchableEntity.id_representado) {
        valido = false;
      }
    }

    return valido;
  }

  find() {
    this.findEntity(this.idRepresentado);
  }

  protected findEntity(searchedValue) {
    if(!this.inicioBusqueda) {

      this.inicioBusqueda = true;

      if (this.verifySearch()) {

        this.events.publish(SearchableEntityComponent.EVENT_SEARCHABLE_ENTITY_ON_SEARCH_INIT, this.getSearchableEntity());

        let loading = this.loadingCtrl.create();
        loading.present();
        let parameters = {"searchedValue": searchedValue, "additionalCriterias": this.additionalCriterias};
        this.searchableEntityProvider.findId(parameters).then(response => {
          loading.dismissAll();
          let entity = null;
          if (response["founded"]) {
            entity = new SearchableEntity(
                              response["results"][0].id,
                              response["results"][0].detalle,
                              response["results"][0].id_representado,
                              response["results"][0].datos_entidad);
            this.focusOnInput();
          } else {
            this.showMensajeRegistroNoEncontrado();
          }
          this.setSearchableEntity(entity);

          this.inicioBusqueda = false;

          this.events.publish(SearchableEntityComponent.EVENT_SEARCHABLE_ENTITY_ON_SEARCH_END, this.getSearchableEntity());


        }).catch(error => {
          loading.dismissAll();
          this.inicioBusqueda = false;
          this.showMensajeErrorEnBusqueda()
          //this.focusOnInput();

        });
      } else {


        // Inicializo el control solo cuando se balnque la entrada y hay una entidad que se busco anteriormente
        if ( this.isEmptySearchableValue() && this.getSearchableEntity() ) {
          this.setSearchableEntity(null);

          // evento onSearchInit
        }

        this.inicioBusqueda = false;

      }
    }
  }


  showMensajeRegistroNoEncontrado() {
    let alert = this.alertCtrl.create({
      title: 'Registro no encontrado',
      subTitle: 'Lamentablemente el registro buscado no existe',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.focusOnInput();
        }
      }]
    });
    alert.present();
  }

  showMensajeErrorEnBusqueda() {
    let alert = this.alertCtrl.create({
      title: 'No se pudo realizar la busqueda',
      subTitle: 'Esto puede deberse a un error en el servidor.',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.inicializar() ;
          this.focusOnInput();
        }
      }]
    });
    alert.present();
  }

  focusOnInput() {

    let input = this.idInput;
    setTimeout(
      () => {
        input.setFocus()
      }, 400);
  }

  private innerValue: any = '';

  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: any) => void = noop;

  onChange() {};
  onTouched() {};

  //get accessor
  get value(): any {
    return this.getSearchableEntity();
  };

  //set accessor including call the onchange callback
  set value(searchableEntity: any) {
    if (searchableEntity !== this.getSearchableEntity() ) {
      this.setSearchableEntity(searchableEntity);
      this.onChangeCallback(searchableEntity);
    }
  }

  writeValue(value: any): void {
    if (value !== this.getSearchableEntity()) {
      this.setSearchableEntity(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {

  }

  removeAdditionalCriteria(id) {
    var index = -1;

    for( var i = 0; i < this.additionalCriterias.length; i++ ) {
      if(id == this.additionalCriterias[i].id) {
        index = this.additionalCriterias.indexOf(this.additionalCriterias[i]);
      }
    }
    if (index > -1) {
      this.additionalCriterias.splice(index, 1);
    }
  }

  removeAllAdditionalCriterias() {
    this.additionalCriterias = [];
  }

  /**
   * Esta función puede ser sobreescrita en las entidades que hereden la clase
   *
   * @param event
   */
  keyPressed(event) {

  }

  // Si el criterio existe lo reemplaza
  addAdditionalCriteria(id, value) {
    this.removeAdditionalCriteria(id);
    this.additionalCriterias.push({'id': id, 'value':value});
  }
}

class  SearchableEntity {
  public id:any;
  public detalle:string;
  public id_representado:any;
  public datos_entidad: any;

  constructor(id: any, detalle: string, idRepresentado: any, datosEntidad: any) {
        this.id = id;
        this.detalle = detalle;
        this.id_representado = idRepresentado;
        this.datos_entidad = datosEntidad;
      }

  toString():string {
       return this.id.toString() + ' - ' +  this.detalle;
      }

}
