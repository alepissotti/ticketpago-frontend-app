import { Loading } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { MyApp } from './../../app/app.component';
import { CARTELERA_PAGE } from './../pages';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {CarteleraProvider} from "../../providers/cartelera/cartelera";
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {VentaProvider} from "../../providers/venta/venta";
import {LOGIN_PAGE, VENTA_PAGE} from "../pages";
import { TurnoProvider } from '../../providers/turno/turno';
import { ReporteProvider } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'cartelera-espectaculo',
  templateUrl: 'cartelera-espectaculo.html'
})
export class CarteleraEspectaculoPage {

  espectaculo: any = null;

  ventaSistemaViejo;

  loadingMessage: Loading;


  url_const : string;

  constructor(public alertCtrl: AlertController,
              public events: Events,
              public loadingCtrl: LoadingController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public usuario: UsuarioProvider,
              public venta: VentaProvider,
              public reporteProvider: ReporteProvider,
              public api: ApiProvider,
              public cartelera: CarteleraProvider,
              public turnoProvider: TurnoProvider,
              public myAppComponent: MyApp) {
 
                this.url_const = 'https://www.ticketway.com.ar/#/cartelera?evento=';
  }

  ionViewWillEnter(){
    if(!this.cartelera.espectaculoElegido.id) {
      this.regresarACartelera()
    }
    this.setEspectaculo();
  }

  setEspectaculo() {
    this.espectaculo = this.cartelera.espectaculoElegido;
  }

  regresarACartelera() {
    this.navCtrl.setRoot(CARTELERA_PAGE);
  }

  comprar() {
    
    if(this.espectaculo.articulo_id) {

      if(this.usuario.estaLogueado() && !this.usuario.isPuntoDeVentaOnline()) {
        this.reporteProvider.ventaEntradaSistemaMostrador({'espectaculoId': this.espectaculo.id});
      } else {
        window.open(this.api.getUrlBackend() + "venta/funcionesanonimas?espectaculoId=" + this.espectaculo.id, '_blank' );
      }
    } else {
      this.procesoCompraNueva();
    }
  }

  procesoCompraNueva() {
    if(this.usuario.estaLogueado()) {
      this.venta.setSelectedEspectaculo(this.espectaculo);

      if(this.espectaculo.tiene_turnos) {
        this.turnoProvider.consultarTurno(this.espectaculo.id).then(response => {
          if(this.turnoProvider.isTurnoActivo()) {
            this.navCtrl.push(VENTA_PAGE);
          }
        }).catch(error => {
          console.log(error);
        })
      } else {
        this.navCtrl.push(VENTA_PAGE);
      }
      
    } else {

      this.myAppComponent.noRedireccionarACartelera();
      
      this.events.subscribe(UsuarioProvider.EVENT_USUARIO_LOGUEADO, this.onLoginIn);

      // Funcion de callback para personalizar solo este componente
      // this.navCtrl.push(LoginPage, {callback: this.onLoginIn});

      this.navCtrl.push(LOGIN_PAGE);

    }
  }

  mostrarBotonDeCompra() {
    if (this.cartelera.espectaculoElegido.tiene_funciones_online == null) return false;
    return this.cartelera.espectaculoElegido.tiene_funciones_online;
  }

  onLoginIn = ()  => {
    this.events.unsubscribe(UsuarioProvider.EVENT_USUARIO_LOGUEADO, this.onLoginIn);
    this.comprar();
  }

  copiarUrl(id) {
    let url = this.url_const + id;
    var aux = document.createElement("input");
    aux.setAttribute("value",url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    document.getElementById("botonCopiar").innerHTML = "Copiado";
    document.getElementById("botonCopiar").style.backgroundColor = "blue";
    }

}