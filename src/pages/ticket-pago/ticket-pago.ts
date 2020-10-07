import {Component} from '@angular/core';
import { IonicPage, NavController, AlertController , NavParams} from 'ionic-angular';
import {VentaProvider , ErrorProvider , UsuarioProvider} from '../../providers/providers';
import {MEDIOS_TICKET_PAGO_PAGE} from '../pages';



@IonicPage()
@Component({
  selector: 'ticket-pago',
  templateUrl: 'ticket-pago.html'
})

export class TicketPagoPage {


  
  usuarioLogin = {
    username : null,
    password : null,
  }

  //idTransaccionTercero -> id de la transaccion de la compra del e-commerce
  transaccionTerceroId : number;

  espectaculoId : number;
  total : number;
  urlEcommerce : string; // URL de respuesta : cancelado , aprobado , rechazado
  puntoVenta : any;
  espectaculosDisponibles : any;
  fucionSectorId : any;
  loading : boolean = true;
  mediosDePagoDisponibles : any;

    constructor(public venta : VentaProvider,
                public usuario : UsuarioProvider,
                public error : ErrorProvider,
                public alertCtrl : AlertController,
                public navCtrl : NavController,
                public navParams : NavParams) {             
                  
    this.cargarDatos();
    }

    ionViewDidLoad() {
      setTimeout( () => {
        this.validarUsuario();
      },1000);
    }

    cargarDatos() {
      this.usuarioLogin.username = this.navParams.get('usernameLogin');
      this.usuarioLogin.password = this.navParams.get('passwordLogin');
      this.espectaculoId = this.navParams.get('espectaculoId');
      this.transaccionTerceroId = this.navParams.get('transaccionTerceroId');
      this.urlEcommerce = this.navParams.get('urlEcommerce');
      this.total = this.navParams.get('total');
    }



      validarUsuario() {
        this.usuario.loginUsuario(this.usuarioLogin).then( () => {
          this.puntoVenta = this.usuario.getPuntoVenta();
          this.venta.getEspectaculosDisponibles().then(response => {
            this.espectaculosDisponibles = response.espectaculos_disponibles;
            this.getFuncionSectorId();
          
          }).catch(error => {
            this.loading = false;
            window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
          })
        
        }).catch(error => {
          this.loading = false;
          window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
        })
      }



      //Obtener la funcion sector correspondiente para registrar la venta en curso
      getFuncionSectorId() {
        for (let i = 0 ; i < this.espectaculosDisponibles.length ; i++) {
          if (this.espectaculosDisponibles[i].id == this.espectaculoId) {
            this.fucionSectorId = this.espectaculosDisponibles[i].first_funcion_sector.id;
            this.loading = false;
          }
        }
      }

      //Funcion para retornar al e-commerce en caso  de que se cancele la venta
      alertVolver () {
        let alert = this.alertCtrl.create({
          title: 'Volver a ' + this.puntoVenta.nombre,
          subTitle: 'Esta seguro que desea cancelar la venta?',
          buttons: [{
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Aceptar',
            handler: async() => {
              await this.usuario.logoutUsuario();
              window.open(this.urlEcommerce + this.setParams("CANCELADO"), '_self');
            }
          }]
        });
        alert.present();
      }



      setParams(estado : string) {
        const params = btoa(`${this.transaccionTerceroId}->${estado}`);
        return params.toString();
      }

      registrarVentaEnCurso() {
        this.loading = true;
        this.venta.registrarVentaEnCurso
        (this.fucionSectorId,1,true,this.total,0,[],this.transaccionTerceroId).then( () => {
            this.registrarEnvio();
        }).catch(error => {
          this.loading = false;
          window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
        })
      }



      registrarEnvio() {
        this.venta.registrarEnvio
        (null,1,this.usuario.getPuntoVenta().id,true,[]).then(response => {
          this.getMediosDePagoDisponibles();
        }).catch(error => {
          this.loading = false;
          window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
        });
        
      }


      getMediosDePagoDisponibles() {
        this.venta.getMediosDePagoDisponibles().then(response => {
          this.mediosDePagoDisponibles = response;
          this.loading = false;
          this.navCtrl.push(MEDIOS_TICKET_PAGO_PAGE,{mediosPago : this.mediosDePagoDisponibles , 
            urlEcommerce : this.urlEcommerce,
            transaccionTerceroId : this.transaccionTerceroId});
        }).catch(error => {
          this.loading = false;
          window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
        });

      }

    
}