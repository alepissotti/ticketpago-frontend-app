import {Component, ViewChild} from '@angular/core';
import {
  Events, IonicPage, LoadingController, ModalController, NavController,
} from 'ionic-angular';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {INGRESO_PUNTO_VENTA_PAGE, MEDIOS_DE_PAGO_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";
import {VentaFinalizadaPage} from "../venta-finalizada/venta-finalizada";

@IonicPage()
@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {
  loading: boolean;
  reservas: any[];
  message: string;
  search: {nro_operacion?: string, reserva_dni?: string , reserva_detalle?: string , espectaculo_id?: number};
  selectedReservas: Array<number>;
  ventaFinalizada: boolean;
  selectAll : boolean;
  seleccion : boolean;
  selectedEspectaculo: any;
  botonEmitir : boolean;

  @ViewChild('nroOperacionInput') nroOperacionInput;

  constructor(private venta: VentaProvider,
              public events: Events,
              private error: ErrorProvider,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private mensaje: MensajeProvider) {
    this.search = {};
    this.selectedReservas = [];
    this.ventaFinalizada = false;
    this.seleccion = this.selectAll = false;
    this.selectedEspectaculo = null;
    this.botonEmitir = true;
  }

  ionViewDidEnter() {
    this.events.subscribe(VentaFinalizadaPage.EVENT_VENTA_FINALIZADA, this.finalizarVenta);
  }

  ionViewDidLoad() {
    this.inicializarFocusEnNroOperacionInput();
  }

  inicializarFocusEnNroOperacionInput() {
    setTimeout(() => {
      this.nroOperacionInput.setFocus();
    }, 1000);
  }

  buscarReservas() {
    let espectaculoId;
    if(this.selectedEspectaculo && this.selectedEspectaculo != 0) {
      espectaculoId = this.selectedEspectaculo.id;
    }
    else espectaculoId = 0;
    this.reservas = null;
    this.selectAll = this.seleccion = false;
    this.selectedReservas = [];
    let loading = this.loadingCtrl.create();
    loading.present();
    let search = {
      nro_operacion: this.search.nro_operacion ? parseInt(this.search.nro_operacion) : null,
      reserva_dni: this.search.reserva_dni ? parseInt(this.search.reserva_dni) : null,
      reserva_detalle: this.search.reserva_detalle ? this.search.reserva_detalle : "",
      espectaculo_id : espectaculoId
    };
    this.venta.getReservas(search).then(response => {
      if (response.length > 1) {
        this.selectReserva(response).then(reservas => {
          this.reservas = reservas;
          this.message = (this.reservas.length) ? 'Seleccione alguna de las reservas para continuar la venta:' : 'No hay reservas';
          loading.dismissAll();
        }).catch(error => {
          loading.dismissAll();
          error.logLevel = 'error';
          error.error = 'Operacion no seleccionada';
          this.error.handle(error);
        })
      } else {
        this.reservas = response;
        this.message = (this.reservas.length) ? 'Seleccione alguna de las reservas para continuar la venta:' : 'No hay reservas';
        loading.dismissAll();
        if(this.nroOperacionInput.value != '') {
          this.inicializarFocusEnNroOperacionInput();
        }
      }
    }).catch(error => {
      loading.dismissAll();
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  selectReserva(reservas: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      let selectReservaModal = this.modalCtrl.create('SelectPage', {items: reservas});
      selectReservaModal.onWillDismiss(data => {
        if (data != null) {          
          resolve([reservas[data]]);
          if(this.nroOperacionInput.value != '') {
            this.inicializarFocusEnNroOperacionInput();
          }
          console.log(reservas[data]);
        } else {
          let error = {
            'logLevel': 'error',
            'error': 'No se seleccionaron datos',
            'text': 'No se seleccionaron datos'
          };
          reject(error);
        }
      });
      selectReservaModal.present().catch(error => {
        reject(error);
      })
    })
  }

  continuarReserva(id) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.venta.continuarReserva(id, this.selectedReservas).then(() => {
      this.navCtrl.push(MEDIOS_DE_PAGO_PAGE);
      loading.dismissAll();
    }).catch(error => {
      loading.dismissAll();
      error.logLevel = 'error';
      this.error.handle(error);
    })
    this.selectAll = this.seleccion = false;
  }

  ubicacionClicked(id) {
    let index = this.selectedReservas.indexOf(id);
    if (index > -1) {
      this.selectedReservas.splice(index, 1);
      if (this.selectedReservas.length == 0) this.selectAll = this.seleccion = false;
    } else {
      this.selectedReservas.push(id);
      if (this.selectedReservas.length == this.cantidadSeleccionadas()){
        this.selectAll = this.seleccion = true;
      } 
    }
    this.botonEmitir = this.seleccionesDelMismoSector();
  }
  cantidadSeleccionadas() {
    let cantidad = 0;
    for (let i = 0; i < this.reservas[0].operacion_funcion_sectores.length; i++) {
      for (let j = 0; j < this.reservas[0].operacion_funcion_sectores[i].ubicaciones.length; j++) {
        cantidad++;
      }
    }
    return cantidad;
  }

  liberarClicked(id) {
    if (this.selectedReservas.length > 0) {
      this.mensaje.presentar(
        'Confirmar cancelar venta',
        '¿Esta seguro/a que desea liberar las ubicaciones seleccionadas?',
        {
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Continuar',
              handler: () => {
                this.liberarReserva(id);
              }
            }
          ]}
        );
    } else {
      this.mensaje.presentar(null, 'Debe seleccionar al menos una ubicación.', null, 3000);
    }
  }

  liberarReserva(id) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.venta.cancelarReserva(id, this.selectedReservas).then(response => {
      loading.dismissAll();
      this.mensaje.presentar(null, 'Se han liberado las ubicaciones selecionadas.', null, 3000);
      this.selectedReservas = [];
      this.reservas = [response.operacion];
      //this.buscarReservas();
    }).catch(error => {
      loading.dismissAll();
      error.logLevel = 'error';
      this.error.handle(error);
    })
    this.selectAll = this.seleccion = false;
  }

  emitirClicked(id) {
    if (this.selectedReservas.length > 0) {
      this.mensaje.presentar(
        'Confirmar reanudar venta',
        'Si continúa la reserva y no finaliza la venta pronto, se anulará la operación. ¿Desea continuar?',
        {
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Continuar',
              handler: () => {
                this.continuarReserva(id);
              }
            }
          ]}
      );
    } else {
      this.mensaje.presentar(null, 'Debe seleccionar al menos una ubicación.', null, 3000);
    }
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  finalizarVenta = () => {
    this.ventaFinalizada = true;
  }

  ionViewWillUnload() {
    this.venta.reset(this.ventaFinalizada);
  }

  cambiarSeleccion() {
    this.seleccion = ! (this.seleccion);
   if (this.seleccion) {
    this.anularTodo();

   }
   else {
     this.selectedReservas = [];

    }
 
   }


   estaSeleccionado(idOperacion) {
     let id = this.selectedReservas.indexOf(idOperacion);
     if (id > -1) return true;
     else return false;
   }

   seleccionar(estado) {
    if (estado == 'ANULADA') return false;
    else return this.seleccion;
   }

  
  anularTodo() {
    for (let i=0 ; i < this.reservas[0].operacion_funcion_sectores.length ; i++ ) {
      let id;
       for (let j=0 ; j < this.reservas[0].operacion_funcion_sectores[i].ubicaciones.length ; j++ ) {
        id = this.reservas[0].operacion_funcion_sectores[i].ubicaciones[j].id;
          if ((!this.estaSeleccionado(id)) && this.seleccionar(this.reservas[0].operacion_funcion_sectores[i].ubicaciones[j].ubicacion_estado.nombre)){
           this.ubicacionClicked(id);
         }
       }
     }
   }

   mostrarSelecciones(){
    let seleccionados = "";
      for (let i=0;i<this.selectedReservas.length;i++) {
        seleccionados+=this.selectedReservas[i] + " - ";
      }
      return seleccionados;
   }

   getSector(id) {
     for (let i=0;i < this.reservas[0].operacion_funcion_sectores.length ; i++) {
        for (let j=0; j < this.reservas[0].operacion_funcion_sectores[i].ubicaciones.length; j++ ){
          if (this.reservas[0].operacion_funcion_sectores[i].ubicaciones[j].id == id) {
            return this.reservas[0].operacion_funcion_sectores[i].funcion_sector.nombre_sector;
          }
        }
     }
     return "";
   }

   seleccionesDelMismoSector()  {
    let nombreSector = this.getSector(this.selectedReservas[0]);
      for (let i=0; i < this.selectedReservas.length; i++) {
        if (nombreSector != this.getSector(this.selectedReservas[i] )) return true;
      }
      return (this.selectedReservas.length == 0);
   }

}
