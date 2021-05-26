import {Component} from '@angular/core';
import {UsuarioProvider, VentaProvider} from '../../providers/providers';
import { IonicPage, NavController} from 'ionic-angular';
import {DESPACHOS_PAGE} from '../pages';




@IonicPage({
    name : 'comprobantes-ecommerce',
    segment : 'comprobantes-ecommerce/:params',
})
@Component({
  selector: 'comprobantes-ecommerce',
  templateUrl: 'comprobantes-ecommerce.html'
},
)

export class ComprobantesEcommercePage {

  
  usuarioLogin = {
    username : null,
    password : null,
  }
  
  params : any;
  empresaId : number;

  loading : boolean = true;
  denegadoText : string = '';



  constructor(
              public usuario : UsuarioProvider,
              public venta: VentaProvider,
              public navCtrl : NavController) {             
    
      this.obtenerParametros();
                    
  }

    ionViewDidLoad() {
      this.validarUsuario();
    }



    
    obtenerParametros() {
      const numberSplit = (window.location.href.includes('www.ticketway.com.ar') ) ?5 :3;
      this.params = atob(window.location.href.replace(window.location.origin,'').split('/')[numberSplit]);
      const datosEnviados = (!this.params) ?null :JSON.parse(this.params);
      this.usuarioLogin.username = (!datosEnviados) ?null :datosEnviados.usernameLogin;
      this.usuarioLogin.password = (!datosEnviados) ?null :datosEnviados.passwordLogin;
      this.empresaId = (!datosEnviados) ?null :datosEnviados.empresaId;
    }

    validarUsuario() {
      this.usuario.loginUsuario(this.usuarioLogin).then(() => {
        this.validarEmpresa();
      }).catch(() => {
        this.loading = false;
        this.denegadoText = 'Acceso denegado , datos de usuario inválidos. Por favor , revise los datos enviados al sistema.';
      });
    }

    validarEmpresa() {
      this.venta.getEspectaculosDisponibles().then(response => {
        const espectaculos_disponibles = response.espectaculos_disponibles;
        if (espectaculos_disponibles.filter(empresa => empresa.id == this.empresaId).length != 1) {
          this.loading = false;
          this.denegadoText = 'Acceso denegado, el id de la empresa no existe o no esta asociada al usuario. Por favor intente nuevamente';          
        } else {
          this.enviarDatos();
        }
      }).catch(() => {
        this.loading = false;
        this.denegadoText = "Hubo un error, intente nuevamente."
      })
    }

    enviarDatos() {
      this.navCtrl.push(DESPACHOS_PAGE,{
        empresaId : this.empresaId,
        cuentaTercero : true
      });
    }

    isEmpty(text) {
      return text === '';
    }
    
    

    
}