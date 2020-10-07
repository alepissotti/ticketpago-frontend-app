import {Component} from '@angular/core';
import { IonicPage, NavController , NavParams , AlertController , ViewController} from 'ionic-angular';
import {VentaProvider , UsuarioProvider} from '../../providers/providers';
import {MEDIOS_LINK_PAGO_PAGE} from '../pages';


@IonicPage()
@Component({
  selector: 'link-ticket-pago',
  templateUrl: 'link-ticket-pago.html'
},
)

export class LinkTicketPagoPage {

usuarioLogin = {
    username : null,
    password : null
}

operacionId : number;
operacion : any;
puntoVenta : any;
loading : boolean = true;
mensaje : string;
bloqueoBotones : boolean = true;
cancelada : boolean;


    constructor(public navCtrl : NavController,
                public navParms : NavParams,
                public usuario : UsuarioProvider,
                public venta : VentaProvider,
                public alertCtrl : AlertController,
                public viewCtrl : ViewController
                ) {             
    
    this.usuarioLogin.username = this.navParms.get('usernameLogin');
    this.usuarioLogin.password = this.navParms.get('passwordLogin');
    this.operacionId = this.navParms.get('operacionId');
    this.cancelada = false;                
    }

    ionViewDidLoad() {  
    }

    validarUsuario() {
        this.usuario.loginUsuario(this.usuarioLogin).then(response => {
            this.puntoVenta = this.usuario.getPuntoVenta();
            this.consultarVencimientoOperacion();
        })
        .catch(error => {
            this.loading = false;
            this.bloqueoBotones = true;
            this.mensaje = "Acceso Denegado";
        })
    }

    consultarVencimientoOperacion() {
        this.loading = true;
        const puntoVentaId = (this.puntoVenta.id) ?parseInt(this.puntoVenta.id) :null;
        const limiteLinkPago = (this.puntoVenta.limite_link_pago) ?parseInt(this.puntoVenta.limite_link_pago) :null;
        const operacionId = (this.operacionId) ?this.operacionId :null;

        this.venta.consultarOperacionLinkPago(operacionId,puntoVentaId,limiteLinkPago).then(response => {
            this.loading = false;
            this.operacion = response[0];
                
                if ((!this.operacion) ) {
                this.bloqueoBotones = true;
                this.mensaje = `Se ha vencido el plazo de pago. 
                Por favor, comuniquese con el vendedor y solicitele un nuevo link de pago.`
                } 
                
                if ((this.operacion ) && this.operacion.operacion_tipo === 2) {
                    this.bloqueoBotones = true;
                    this.mensaje = `Estimado ${this.operacion.detalle_cliente ?this.operacion.detalle_cliente :''}
                    su pago ha sido registrado con el número de operación ${this.operacion.nro_operacion}. 
                    Muchas gracias por elegirnos.`;
                }
                if ((this.operacion) && this.operacion.operacion_tipo === 1) {
                    this.bloqueoBotones = false;
                    this.mensaje = `Estimado ${this.operacion.detalle_cliente ?this.operacion.detalle_cliente :''} 
                    su compra tiene un monto de $ ${parseFloat(this.operacion.precio) + parseFloat(this.operacion.cargo_servicio)}`
                }

                if (this.cancelada) {
                    this.bloqueoBotones = true;
                    this.mensaje = `La operación ha sido cancelada. 
                    Por favor, comuniquese con el vendedor y solicitele un nuevo link de pago.`;
                }
            
        })
        .catch(error => {
            this.loading = false;
            this.bloqueoBotones = true;
            this.mensaje ="Acceso Denegado";
        })
    }

    alertCancelar () {
        let alert = this.alertCtrl.create({
          title: 'Cancelar operación',
          subTitle: `Esta seguro de cancelar la operación? 
          Si oprime aceptar la operación será cancelada, y este link ya no tendrá vigencia para realizar el pago. `,
          buttons: [{
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.cancelarOperacion();
            }
          }]
        });
        alert.present();
      }

      cancelarOperacion() {
        this.loading = true;
        this.cancelada = true;  
        this.venta.cancelarVentaLinkPago(this.operacionId).then( () => {
              this.consultarVencimientoOperacion();
          }).catch(error => {
              this.loading = false;
              this.bloqueoBotones = true;
              this.mensaje = "Acceso Denegado";
          })
      }


      continuarOperacion() {
        this.loading = true;
        const puntoVentaId = (this.puntoVenta.id) ?parseInt(this.puntoVenta.id) :null;
        const limiteLinkPago = (this.puntoVenta.limite_link_pago) ?parseInt(this.puntoVenta.limite_link_pago) :null;
        const operacionId = (this.operacionId) ?this.operacionId :null;

        this.venta.consultarOperacionLinkPago(operacionId,puntoVentaId,limiteLinkPago).then(response => {
            this.operacion = response[0];
            if (!this.operacion) {
                this.loading = false;
                this.bloqueoBotones = true;
                this.mensaje = `Se ha vencido el plazo de pago. 
                Por favor, comuniquese con el vendedor y solicitele un nuevo link de pago.`
            } else {
                this.venta.continuarOperacionLinkPago(this.operacionId).then(response => {
                    this.loading = false;  
                    const mediosDePago = response;
                    this.navCtrl.push(MEDIOS_LINK_PAGO_PAGE,{
                        operacionId : this.operacionId,
                        montoOperacion : parseFloat(this.operacion.precio),
                        mediosDePago : mediosDePago,
                    }).then(() => {
                    })
                  
                    }).catch(error => {
                      this.loading = false;
                      this.bloqueoBotones = true;
                      this.mensaje = "Acceso Denegado";
                  })
            }
        })
        .catch(error => {
            this.loading = false;
            this.bloqueoBotones = true;
            this.mensaje ="Acceso Denegado";
        })
      }

      ionViewDidEnter() {
        this.loading = true;
        this.cancelada = this.navParms.get('cancelada') ?this.navParms.get('cancelada') :false;  
        this.validarUsuario();
      }
      






    
}