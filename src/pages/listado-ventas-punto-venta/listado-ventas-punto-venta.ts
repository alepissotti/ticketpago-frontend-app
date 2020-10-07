import { ReporteProvider } from './../../providers/reporte/reporte';
import { MensajeProvider } from './../../app/shared/providers/mensaje/mensaje';
import { SearchablePuntoVentaComponent } from './../../components/searchable-punto-venta/searchable-punto-venta';
import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchableFuncionComponent } from '../../components/searchable-funcion/searchable-funcion';
import { SearchableEspectaculoComponent } from '../../components/searchable-espectaculo/searchable-espectaculo';
import { UsuarioProvider } from '../../providers/providers';

/**
 * Generated class for the ListadoVentaDiariaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-ventas-punto-venta',
  templateUrl: 'listado-ventas-punto-venta.html',
})
export class ListadoVentasPuntoVentaPage {

  @ViewChild('searchablePuntoVenta') searchablePuntoVenta: SearchablePuntoVentaComponent;
  @ViewChild('searchableEspectaculo') searchableEspectaculo: SearchableEspectaculoComponent;
  @ViewChild('searchableFuncion') searchableFuncion: SearchableFuncionComponent;

  puntoVenta: any;
  espectaculo: any;
  funcion: any;
  soloEspectaculosActivos: boolean = true;
  tipoSalidaReporte: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public reporteProvider: ReporteProvider,
              public mensaje: MensajeProvider,
              public user: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.searchableEspectaculo.setPuntoVentaYActivos(this.user.getPuntoVenta());
    this.searchableFuncion.setSoloFuncionesActivas();
    if(this.usuarioPuedeUtilizarBuscadorPuntosVenta()) {
      this.searchablePuntoVenta.focusOnInput();
    }
  }

  usuarioPuedeUtilizarBuscadorPuntosVenta() {
    return this.user.permiso(this.user.PERMISO_LISTADO_VENTA_BUSQUEDA_PUNTO_VENTA);
  }

  updateSearchableFuncion(event){
    this.searchableFuncion.inicializar();
    this.searchableFuncion.setEspectaculo(event.searchableEntity);

  }

  getListadoVentasPuntoVenta() {

    let puntoVentaId = null;
    if(this.puntoVenta) {
      puntoVentaId = this.puntoVenta.id;
    }

    let espectaculoId = null;
    if(this.espectaculo) {
      espectaculoId = this.espectaculo.id;
    } else {
      this.mensaje.presentar(null, 'Debe seleccionar el espectaculo que desea listar.', null, 3000); return;
    }

    let funcionId = null;
    if(this.funcion) {
      funcionId = this.funcion.id;
    }

    this.reporteProvider.imprimirListadoVentasPuntoVenta({
                                            'punto_venta': puntoVentaId,
                                            'espectaculo': espectaculoId, 
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
