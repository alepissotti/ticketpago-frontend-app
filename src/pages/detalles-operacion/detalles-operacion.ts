import { VentaProvider } from './../../providers/venta/venta';
import { ErrorProvider } from './../../providers/error/error';
import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SearchableOperacionComponent } from '../../components/searchable-operacion/searchable-operacion';

/**
 * Generated class for the DetallesOperacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalles-operacion',
  templateUrl: 'detalles-operacion.html',
})
export class DetallesOperacionPage {

  @ViewChild('searchableOperacion') searchableOperacion: SearchableOperacionComponent;

  operacion: any = null;
  searchableEntityOperacion: any = null;

  constructor(private error: ErrorProvider,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public ventaProvider: VentaProvider) {
  }

  ionViewDidLoad() {
    this.searchableOperacion.focusOnInput();
  }

  updateSearchableOperacion(event){
    let searchedEntity = event.searchableEntity;

    if(searchedEntity) {
      
      let loading = this.loadingCtrl.create();
      loading.present();

      this.ventaProvider.getDetallesOperacion({ operacionId: searchedEntity.id }).then( (response) => {
        this.operacion = response.operacion;
        loading.dismissAll();
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      });

    } else {
      this.operacion = null;
      this.searchableEntityOperacion = null;
    }
  }

  verDetalleOperacionMedioPago(operacionMedioPago) {

    let operacionMedioPagoAutorizacion = operacionMedioPago.operacion_medio_pago_autorizacion;

    let texto = '';

    if( operacionMedioPagoAutorizacion && 
        operacionMedioPagoAutorizacion.detalle_documento && 
        operacionMedioPagoAutorizacion.nombre_apellido_titular &&
        operacionMedioPagoAutorizacion.nro_documento &&
        operacionMedioPagoAutorizacion.ultimos_cuatro_digitos_tarjeta) {
      texto += '<div>Titular tarjeta: '+operacionMedioPagoAutorizacion.nombre_apellido_titular+'</div>';
      texto += '<div>Documento: '+operacionMedioPagoAutorizacion.detalle_documento+' '+operacionMedioPagoAutorizacion.nro_documento+'</div>';
      texto += '<div>Ultimos 4 digitos: '+operacionMedioPagoAutorizacion.ultimos_cuatro_digitos_tarjeta+'</div><div></div>';
    }

    texto += '<div>Ubicaciones:</div><div>';

    for (let i = 0; i < operacionMedioPago.operacion_medio_pago_ubicaciones.length; i++) {

      let operacionMedioPagoUbicacion = operacionMedioPago.operacion_medio_pago_ubicaciones[i];
      texto += operacionMedioPagoUbicacion.operacion_ubicacion.detalle_ubicacion + '<br/>';
    }

    texto += '</div>';

    let alert = this.alertCtrl.create({
      title: 'Detalles del movimiento realizado (id: '+operacionMedioPago.id+')',
      subTitle: texto,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

}