import {Component} from '@angular/core';
import { IonicPage, NavParams} from 'ionic-angular';
import {VentaProvider , ErrorProvider , UsuarioProvider} from '../../providers/providers';




@IonicPage()
@Component({
  selector: 'transaccion-ticketpago',
  templateUrl: 'transaccion-ticketpago.html'
})

export class TransaccionTicketPagoPage {

usuarioLogin = {
    username : null,
    password : null
}

puntoVenta : any = null;
empresaId : number = null;
transaccionTerceroId : number = null;
respuestaConsulta : any;
loading : boolean = true;



    constructor(public venta : VentaProvider,
                public usuario : UsuarioProvider,
                public error : ErrorProvider,
                public navParms : NavParams) {             
    
        this.usuarioLogin.username = this.navParms.get('userName');
        this.usuarioLogin.password = this.navParms.get('userPassword')
        this.empresaId = this.navParms.get('empresaId');
        this.transaccionTerceroId = this.navParms.get('transaccionTerceroId');

                    
    }

    ionViewDidLoad() {
        setTimeout( () => {
            this.validarUsuario();
        },1000);
    }

    validarUsuario = async() => {
        await this.usuario.loginUsuario(this.usuarioLogin);
        this.puntoVenta = this.usuario.getPuntoVenta();
        this.consultarTransaccion();
      }
  
    consultarTransaccion() {
        this.venta.consultarTransaccionTercero(this.empresaId,
          this.transaccionTerceroId).then(response => {
            this.respuestaConsulta = response[0];
            this.loading = false;
        }).catch(error => {
          error.logLevel = 'error';
          this.error.handle(error);
        })
    }


    
}