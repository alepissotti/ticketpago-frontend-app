import { UsuarioProvider } from './../../providers/usuario/usuario';
import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {ESPECTACULOS_DISPONIBLES_PAGE, MENU_VENTA_PAGE, VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage({
  defaultHistory: [ESPECTACULOS_DISPONIBLES_PAGE, VENTA_PAGE, MENU_VENTA_PAGE]
})
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {
  ventaReservada: any;
  selectSexo: Array<any>;
  selectTipoDni: Array<any>;
  clienteDni: string;
  clienteDetalle: string;

  @ViewChild('dniCliente') dniCliente;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              public usuarioProvider: UsuarioProvider,
              private venta: VentaProvider,
              private mensaje: MensajeProvider,
              private loadingCtrl: LoadingController) {
    this.ventaReservada = this.venta.getVentaReservada();
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
    this.clienteDetalle = "";
    this.clienteDni="";
  }



  ionViewDidLoad() {
    setTimeout(() => {
      this.dniCliente.setFocus();
    }, 500);

  }



  reservarEntradas() {
    let loading = this.loadingCtrl.create();
    loading.present();
    let id = "57359";
    let sexo = "M";
    let nro_dni = "987654321";
    let tipo_documento = "1";
    let email = "bloqueo@bloqueo.com";
    let apellido = "Organización";
    let nombres = "Bloqueo"
    let telCaracteristica = "342";
    let telNumero = "342342342";
    let dni_reserva = this.clienteDni;
    let detalle_reserva = this.clienteDetalle;
    let datosPersona: { personaId?: number, sexo?: string, nroDocumento?: number, tipoDocumento?: number, email?: string, apellido?: string, nombres?: string, reserva_dni?:number , reserva_detalle?:string, telefono?: { caracteristica?: string, numero?: string } } = {};
    id ? datosPersona.personaId = parseInt(id) : '';
    sexo ? datosPersona.sexo = sexo : '';
    nro_dni ? datosPersona.nroDocumento = parseInt(nro_dni) : '';
    tipo_documento ? datosPersona.tipoDocumento = parseInt(tipo_documento) : '';
    email ? datosPersona.email = email : '';
    apellido ? datosPersona.apellido = apellido : '';
    nombres ? datosPersona.nombres = nombres : '';
    dni_reserva ? datosPersona.reserva_dni = parseInt(dni_reserva) : '';
    detalle_reserva ? datosPersona.reserva_detalle = detalle_reserva : '';
    if (telCaracteristica || telNumero) {
      datosPersona.telefono = {};
      telCaracteristica ? datosPersona.telefono.caracteristica = telCaracteristica : '';
      telNumero ? datosPersona.telefono.numero = telNumero : '';
    }
    this.venta.reservar(datosPersona).then(() => {
      loading.dismissAll();
      let message : string = 'Los lugares han sido reservados con el numero de operacion <h1><strong>'+this.venta.getOperacionNroOperacion()+'</strong></h1>';
      this.mensaje.presentar('Lugares Reservados', message, {buttons: [{ text: 'Aceptar' }]});
      this.venta.reset(true);
      this.navCtrl.setRoot(ESPECTACULOS_DISPONIBLES_PAGE).catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      });
    }).catch(error => {
      loading.dismissAll();
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  mostrarBoton(){
    return (this.clienteDetalle.trim().length > 0);
  }

}
