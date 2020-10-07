import {Component} from '@angular/core';
import {UsuarioProvider} from '../../providers/providers';
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
              public navCtrl : NavController) {             
    
      this.obtenerParametros();
      this.validarUsuario();
                    
  }

    ionViewDidLoad() {

    }



    
    obtenerParametros() {
      this.params = atob(window.location.href.replace(window.location.origin,'').split('/')[3]);
      this.usuarioLogin.username = this.params.split('->')[0];
      this.usuarioLogin.password = this.params.split('->')[1];
      this.empresaId = parseFloat(this.params.split('->')[2]);
    }

    validarUsuario() {
      this.usuario.loginUsuario(this.usuarioLogin).then(() => {
        this.loading = false;
        
        this.enviarDatos();
      }).catch(error => {
        this.loading = false;
        this.denegadoText = 'Acceso denegado , datos de usuario inválidos. Por favor , revise los datos enviados al sistema.';
      });
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