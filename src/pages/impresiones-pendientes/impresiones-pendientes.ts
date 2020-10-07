import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorProvider, PrinterProvider, VentaProvider} from "../../providers/providers";
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage()
@Component({
  selector: 'page-impresiones-pendientes',
  templateUrl: 'impresiones-pendientes.html',
})
export class ImpresionesPendientesPage {
  loading: boolean;
  pendientes: any[];
  message: string;

  constructor(private venta: VentaProvider,
              private error: ErrorProvider,
              public mensaje: MensajeProvider,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private printer: PrinterProvider) {
  }

  ionViewDidLoad() {
    this.getImpresionesPendientes();
  }

  getImpresionesPendientes() {
    this.loading = true;
    this.venta.getImpresionesPendientes().then(response => {
      this.pendientes = response;
      this.message = (this.pendientes.length) ? 'Seleccione una venta para imprimir el/los tickets:' : 'No hay impresiones pendientes';
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  pendienteClicked(pendiente) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.mensaje.presentar(
        'Imprimiento Tickets',
      'Se esta imprimiendo su ticket',
      {
                  buttons: ['Ok']
              });
    this.printer.status().then(response => {
      this.printer.print(pendiente.id).then(() => { //Si la impresora se encuentra definida
        this.pendientes = [];
        this.message = '';
        loading.dismissAll();
        this.getImpresionesPendientes();
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    }).catch(() => { //Si la impresora no esta definida o no se encuentra
        loading.dismissAll();
        let errorImpresora = {
          'logLevel': 'error',
          'error': 'Impresora no encontrada',
          'text': 'Impresora no encontrada'
        };

        this.error.handle(errorImpresora);
      }
    );
  }

  updateClicked() {
    this.pendientes = [];
    this.message = '';
    this.getImpresionesPendientes();
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

}
