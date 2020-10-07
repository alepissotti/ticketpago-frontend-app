import { ListadoFuncionSectoresComponent } from './../../components/listado-funcion-sectores/listado-funcion-sectores';
import { ListadoFuncionesComponent } from './../../components/listado-funciones/listado-funciones';
import { PLANO_PAGE } from './../pages';
import { Component } from '@angular/core';
import { Events, IonicPage, ModalController } from 'ionic-angular';
import {ErrorProvider, UsuarioProvider, VentaProvider} from "../../providers/providers";
import {ListadoEspectaculosDisponiblesComponent} from "../../components/listado-espectaculos-disponibles/listado-espectaculos-disponibles";

/**
 * Generated class for the EspectaculosDisponiblesProductorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-espectaculos-disponibles-productor',
  templateUrl: 'espectaculos-disponibles-productor.html',
})
export class EspectaculosDisponiblesProductorPage {

  loading: boolean;
  message: string;
  userInfo: any;
  isOnline: boolean;
  puntoVentaMensajes: any[];

  espectaculos: any;
  espectaculo: any;
  funciones: any;
  funcion: any;
  funcionSectores: any;
  funcionesMessage: string;
  funcionSector: any;
  sectoresPorPlano: any;
  configuracionPlano: any;

  constructor(private error: ErrorProvider,
              private events: Events,
              private modalCtrl: ModalController,
              private usuario: UsuarioProvider,
              private venta: VentaProvider) {

      this.userInfo = this.usuario.getUser();
      this.isOnline = this.usuario.isPuntoDeVentaOnline();
      this.puntoVentaMensajes = [];
  }

  ionViewDidLoad() {
    this.getEspectaculosDisponibles();
  }

  ionViewWillEnter() {
    this.events.subscribe(ListadoEspectaculosDisponiblesComponent.EVENT_UPDATE_ESPECTACULOS, this.updateClicked);
    this.events.subscribe(ListadoEspectaculosDisponiblesComponent.EVENT_ESPECTACULO_ELEGIDO, this.espectaculoClicked);
    this.events.subscribe(ListadoFuncionesComponent.EVENT_UPDATE_FUNCIONES, this.updateClicked);
    this.events.subscribe(ListadoFuncionesComponent.EVENT_FUNCION_ELEGIDA,this.funcionClicked);
    this.events.subscribe(ListadoFuncionesComponent.EVENT_CLICK_CANCELAR, this.updateClicked);
    this.events.subscribe(ListadoFuncionSectoresComponent.EVENT_UPDATE_FUNCION_SECTORES, this.updateClicked);
    this.events.subscribe(ListadoFuncionSectoresComponent.EVENT_FUNCION_SECTOR_ELEGIDO, this.funcionSectorClicked);
    this.events.subscribe(ListadoFuncionSectoresComponent.EVENT_CLICK_CANCELAR, this.updateClicked);
  }

  ionViewWillLeave() {
    this.events.unsubscribe(ListadoEspectaculosDisponiblesComponent.EVENT_UPDATE_ESPECTACULOS, this.updateClicked);
    this.events.unsubscribe(ListadoEspectaculosDisponiblesComponent.EVENT_ESPECTACULO_ELEGIDO, this.espectaculoClicked);
    this.events.unsubscribe(ListadoFuncionesComponent.EVENT_UPDATE_FUNCIONES, this.updateClicked);
    this.events.unsubscribe(ListadoFuncionesComponent.EVENT_FUNCION_ELEGIDA,this.funcionClicked);
    this.events.unsubscribe(ListadoFuncionesComponent.EVENT_CLICK_CANCELAR, this.updateClicked);
    this.events.unsubscribe(ListadoFuncionSectoresComponent.EVENT_UPDATE_FUNCION_SECTORES, this.updateClicked);
    this.events.unsubscribe(ListadoFuncionSectoresComponent.EVENT_FUNCION_SECTOR_ELEGIDO, this.funcionSectorClicked);
    this.events.unsubscribe(ListadoFuncionSectoresComponent.EVENT_CLICK_CANCELAR, this.updateClicked);
  }

  getEspectaculosDisponibles() {
    this.loading = true;
    this.venta.getEspectaculosDisponibles().then(response => {
      this.espectaculos = response.espectaculos_disponibles;
      this.puntoVentaMensajes = response.punto_venta_mensajes;
      this.message = (this.espectaculos.length) ? 'Seleccione alguno de los espectaculos disponibles a la venta:' : 'No hay espectáculos disponibles';
      this.loading = false
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  espectaculoClicked = (espectaculo) => {
    this.espectaculo = espectaculo;
    this.loading = true;
    this.venta.getFuncionesDisponibles(espectaculo.id).then(response => {
      this.funciones = response.funciones_disponibles;
      this.funcionesMessage = (this.funciones.length) ? 'Seleccione alguna de las funciones disponibles:' : 'No hay funciones disponibles';
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle({text: 'Hubo un error al obtener las funciones disponibles. Intente nuevamente más tarde'});
    });
  }

  funcionClicked = (funcion) => {
    this.funcion = funcion;
    this.loading = true;
    this.venta.getDetalleSectoresFuncion(funcion.id).then(response => {
      this.funcionSectores = response['plano_sectores_d_t_o'];
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle({text: 'Hubo un error al obtener los datos de la función. Intente nuevamente o pruebe más tarde'});
    })
  }

  funcionSectorClicked = (funcionSector) => {
    this.funcionSector = funcionSector;
    this.showPlano();
  }

  slideChanged() {

  }

  updateClicked = () => {
    this.espectaculo = null;
    this.espectaculos = [];
    this.funcion = null;
    this.funciones = [];
    this.funcionSector = null;
    this.funcionSectores = [];
    this.message = '';
    this.getEspectaculosDisponibles();
  }

  showPlano() {
    let planoModal = this.modalCtrl.create(PLANO_PAGE, {maxUbicaciones: 0, funcionId: this.funcion.id, planoConfiguracionId: this.funcionSector.plano_configuracion_id}, { cssClass: "modal-fullscreen" } ) ;
    planoModal.onDidDismiss(data => {});
    planoModal.present().catch(error => {
      this.error.handle({error: error, logLevel: 'error'});
    })
  }

}