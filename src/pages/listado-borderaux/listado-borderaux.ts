import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { SearchableFuncionComponent } from './../../components/searchable-funcion/searchable-funcion';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchableEspectaculoComponent } from '../../components/searchable-espectaculo/searchable-espectaculo';
import { UsuarioProvider, ReporteProvider } from '../../providers/providers';

/**
 * Generated class for the ListadoBorderauxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-borderaux',
  templateUrl: 'listado-borderaux.html',
})
export class ListadoBorderauxPage {

  @ViewChild('searchableEspectaculo') searchableEspectaculo: SearchableEspectaculoComponent;
  @ViewChild('searchableFuncion') searchableFuncion: SearchableFuncionComponent;

  espectaculo: any;
  funcion: any;
  soloEspectaculosActivos: boolean = true;
  tipoSalidaReporte: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public reporteProvider: ReporteProvider,
              private user: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.searchableEspectaculo.setPuntoVentaYActivos(this.user.getPuntoVenta());
    this.searchableFuncion.setSoloFuncionesActivas();
    this.searchableEspectaculo.focusOnInput();
  }

  updateSearchableFuncion(event){
    this.searchableFuncion.inicializar();
    this.searchableFuncion.setEspectaculo(event.searchableEntity);

  }

  getInformeBorderaux() {

    let espectaculoId = null;
    if(this.espectaculo) {
      espectaculoId = this.espectaculo.id;
    }

    let funcionId = null;
    if(this.funcion) {
      funcionId = this.funcion.id;
    }

    this.reporteProvider.imprimirBorderaux({ 'espectaculo': espectaculoId, 
                                            'funcion': funcionId, 
                                            'solo_espectaculos_activos': this.soloEspectaculosActivos,
                                            'tipo_salida': this.tipoSalidaReporte});
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  soloEspectaculosActivosClicked() {

    //Quita criterios de busqueda antes establecidos
    this.searchableEspectaculo.removeAllAdditionalCriterias();

    if(this.soloEspectaculosActivos) {
      this.searchableEspectaculo.setPuntoVentaYActivos(this.user.getPuntoVenta());
      this.searchableFuncion.setSoloFuncionesActivas();
    } else {
      this.searchableEspectaculo.setPuntoVenta(this.user.getPuntoVenta());
      this.searchableFuncion.removeAdditionalCriteria(SearchableFuncionComponent.ADDITIONAL_CRITERIA_SOLO_FUNCIONES_ACTIVAS_ID);
    }
  }

  setTipoSalida(event) {
    this.tipoSalidaReporte = event.tipoSalida;
  }

}
