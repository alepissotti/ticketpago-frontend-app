import {Component} from '@angular/core';
import {Events, IonicPage, NavController} from 'ionic-angular';
import {ErrorProvider, UsuarioProvider, VentaProvider} from "../../providers/providers";
import {ListadoEspectaculosDisponiblesComponent} from "../../components/listado-espectaculos-disponibles/listado-espectaculos-disponibles";
import {OrdenadorEspectaculosPipe} from "../../pipes/ordenador-espectaculos/ordenador-espectaculos";

@IonicPage()
@Component({
  selector: 'page-espectaculos-disponibles',
  templateUrl: 'espectaculos-disponibles.html',
  providers: [OrdenadorEspectaculosPipe]

})
export class EspectaculosDisponiblesPage {
  loading: boolean;
  espectaculos: any[];
  message: string;
  userInfo: any;
  isOnline: boolean;
  puntoVentaMensajes: any[];
  cuentaTercero : boolean;
  titulo : string;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              private events: Events,
              private usuario: UsuarioProvider,
              private venta: VentaProvider) {
    this.userInfo = this.usuario.getUser();
    this.isOnline = this.usuario.isPuntoDeVentaOnline();
    this.puntoVentaMensajes = [];
    this.espectaculos = [];
    this.cuentaTercero = this.usuario.esCuentaTercero();
    this.titulo = this.asignarTitulo();
  }

  asignarTitulo() {
    if (this.cuentaTercero) return 'Cobranzas';
    else return 'Espectaculos';
  }

  ionViewDidLoad() {
    this.getEspectaculosDisponibles();
  }

  ionViewWillEnter() {
    this.events.subscribe(ListadoEspectaculosDisponiblesComponent.EVENT_UPDATE_ESPECTACULOS, this.updateClicked);
    this.events.subscribe(ListadoEspectaculosDisponiblesComponent.EVENT_ESPECTACULO_ELEGIDO, this.espectaculoClicked);
  }

  ionViewWillLeave() {
    this.events.unsubscribe(ListadoEspectaculosDisponiblesComponent.EVENT_UPDATE_ESPECTACULOS, this.updateClicked);
    this.events.unsubscribe(ListadoEspectaculosDisponiblesComponent.EVENT_ESPECTACULO_ELEGIDO, this.espectaculoClicked);
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
    this.venta.setSelectedEspectaculo(espectaculo);
    this.navCtrl.push('VentaPage').catch(error => {
      this.error.handle({error: error, text: 'Ha ocurrido un error. Intente nuevamente más tarde.', logLevel: 'error'});
    })
  }

  updateClicked = () => {
    this.espectaculos = [];
    this.message = '';
    this.getEspectaculosDisponibles();
  }

}
