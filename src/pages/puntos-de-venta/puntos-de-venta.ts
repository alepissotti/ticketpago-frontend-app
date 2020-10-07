import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorProvider, VentaProvider, PrinterProvider} from "../../providers/providers";
import {ESPECTACULOS_DISPONIBLES_PAGE, MENU_VENTA_PAGE, VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage({
  defaultHistory: [ESPECTACULOS_DISPONIBLES_PAGE, VENTA_PAGE, MENU_VENTA_PAGE]
})
@Component({
  selector: 'page-puntos-de-venta',
  templateUrl: 'puntos-de-venta.html',
})
export class PuntosDeVentaPage {
  loading: boolean;
  message: string;
  puntosDeVenta: Array<any>;
  ventaReservada: any;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              private venta: VentaProvider,
              private printer: PrinterProvider,
              private mensaje: MensajeProvider,
              private loadingCtrl: LoadingController) {
    this.ventaReservada = this.venta.getVentaReservada();
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
  }

  ionViewDidLoad() {
    this.getPuntosDeVenta();
  }

  getPuntosDeVenta() {
    this.loading = true;
    this.venta.getPuntosDeVenta().then(response => {
      this.puntosDeVenta = response;
      this.message = (this.puntosDeVenta.length) ? 'Seleccione el punto de venta:' : 'No hay puntos de venta disponibles';
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  puntoDeVentaClicked(puntoDeVenta) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.venta.preimprimir(puntoDeVenta.id).then(() => {
      this.mensaje.presentar('Imprimiendo Tickets', 'La compra se ha registrado correctamente. Se esta imprimiendo su ticket', {buttons: ['Ok']});
      this.printer.print(this.venta.getOperacionId()).then(response => {
        loading.dismissAll();
        this.venta.reset(true);
        this.navCtrl.setRoot(ESPECTACULOS_DISPONIBLES_PAGE).catch(error => {
          this.error.handle({error: error, logLevel: 'error'});
        });
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
        this.mensaje.presentar(
              'Fallo en impresión', 
              'La impresión de los tickets no se pudo realizar, intente nuevamente desde "Impresiones Pendientes" (Nro operación: ' + this.venta.getOperacionNroOperacion(), 
              {buttons: [ {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
                }
              }]});
        this.venta.reset(true);
      })
    }).catch(error => {
      loading.dismissAll();
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

}
