import { ReporteProvider } from './../../providers/reporte/reporte';
import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchableEspectaculoComponent } from '../../components/searchable-espectaculo/searchable-espectaculo';
import { UsuarioProvider } from '../../providers/providers';
import { SearchableTipoEnvioComponent } from '../../components/searchable-tipo-envio/searchable-tipo-envio';

/**
 * Generated class for the ListadoOperacionesAEntregarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-operaciones-a-entregar',
  templateUrl: 'listado-operaciones-a-entregar.html',
})
export class ListadoOperacionesAEntregarPage {

  @ViewChild('searchableEspectaculo') searchableEspectaculo: SearchableEspectaculoComponent;
  @ViewChild('searchableTipoEnvio') searchableTipoEnvio: SearchableTipoEnvioComponent;

  espectaculo: any;
  soloEspectaculosActivos: boolean = true;
  tipoEnvio: any;
  tipoSalidaReporte: any;
  ordenPorDocumento: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public api: ApiProvider,
              private user: UsuarioProvider,
              private reporteProvider: ReporteProvider) {
  }

  ionViewDidLoad() {
    this.searchableEspectaculo.setPuntoVenta(this.user.getPuntoVenta());
    this.searchableEspectaculo.focusOnInput();
  }

  getListadoOperacionesAEntregar() {

    let espectaculoId = null;
    if(this.espectaculo) {
      espectaculoId = this.espectaculo.id;
    }

    let tipoEnvioId = null;
    if(this.tipoEnvio) {
      tipoEnvioId = this.tipoEnvio.id;
    }

    this.reporteProvider.getListadoOperacionesAImprimir({ espectaculoId: espectaculoId,
                                                          tipoEnvioId: tipoEnvioId,
                                                          ordenPorDocumento: this.ordenPorDocumento,
                                                          tipo_salida: this.tipoSalidaReporte});
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  soloEspectaculosActivosClicked() {

    //Quita criterios de busqueda antes establecidos
    this.searchableEspectaculo.removeAllAdditionalCriterias();

    if(this.soloEspectaculosActivos) {
      this.searchableEspectaculo.setPuntoVentaYActivos(this.user.getPuntoVenta());
    } else {
      this.searchableEspectaculo.setPuntoVenta(this.user.getPuntoVenta());
    }
  }

  setTipoSalida(event) {
    this.tipoSalidaReporte = event.tipoSalida;
  }

}
