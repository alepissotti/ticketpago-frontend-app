import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';

/**
 * Generated class for the SearchableEntityCriteriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchable-entity-criteria',
  templateUrl: 'searchable-entity-criteria.html',
})
export class SearchableEntityCriteriaPage {

  public searchableCriterias: any;
  public searchableEntityProvider: any;
  public foundedSearchableEntities: any;
  public criteria: any;
  public detalle: any;
  public additionalCriterias: any = [];
  public createPage: any = null;

  @ViewChild('idInput') idInput;

  constructor(protected alertCtrl: AlertController,
              protected navCtrl: NavController,
              protected modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              protected viewCtrl: ViewController) {
    this.searchableCriterias = this.navParams.get('searchableCriterias');
    this.criteria = this.searchableCriterias[0];
    this.searchableEntityProvider = this.navParams.get('searchableEntityProvider');
    this.foundedSearchableEntities = null;
    this.additionalCriterias = this.navParams.get('additionalCriterias');
    this.createPage = this.navParams.get('createPage');
  }

  ionViewDidEnter() {
    this.focusOnInput(this.idInput);
  }

  search() {
    this.foundedSearchableEntities = null;
    let loading = this.loadingCtrl.create();
    loading.present();

    this.searchableEntityProvider.findCriteria({"searchedValue": this.detalle, "criteriaId": this.criteria.id, "additionalCriterias": this.additionalCriterias}).then((response) => {
      if(response.founded) {
        this.foundedSearchableEntities = response.results;
        loading.dismissAll();
      } else {
        loading.dismissAll();
        this.mostrarMensajeRegistrosNoEncontrados();
      }
    }).catch( (error) => {
      loading.dismissAll();
      this.focusOnInput(this.idInput);
    });
  }

  private mostrarMensajeRegistrosNoEncontrados() {
    let alert = this.alertCtrl.create({
      title: 'Registros no encontrados',
      subTitle: 'Lamentablemente no existen registros con el criterio buscado, intente nuevamente',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.focusOnInput(this.idInput);
        }
      }]
    });
    alert.present();
  }

  selectEntity(searchableEntity){
    this.viewCtrl.dismiss(searchableEntity);
  }

  focusOnInput(input) {
    setTimeout(
      () => {input.setFocus()}, 300);
  }

  createEntity() {
    let criteriaSearchModal = this.modalCtrl.create(
      this.createPage, {createEntity: true});
    criteriaSearchModal.present();
    criteriaSearchModal.onDidDismiss(data => {
      
      if (data) {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.searchableEntityProvider.findId({"searchedValue": data.id}).then( (response) => {
          
          loading.dismissAll();
          this.selectEntity(response.results[0]);

        });
        }

    });
  }

  cancelar() {
    this.selectEntity(null);
  }
}
