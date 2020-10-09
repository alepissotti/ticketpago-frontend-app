import { CARTELERA_PAGE } from './../pages';
import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, AlertController, Events } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiProvider, ErrorProvider, UsuarioProvider} from "../../providers/providers";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;

  @ViewChild('form') form;
  @ViewChild('usernameInput') usernameInput;

  constructor(private navCtrl: NavController,
              private usuario: UsuarioProvider,
              private events: Events,
              private api: ApiProvider,
              private error: ErrorProvider,
              private alertCtrl: AlertController,
              private mensaje: MensajeProvider,
              private formBuilder: FormBuilder,
              ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  loginSubmit() {
    if (this.loginForm.valid) {
      
      this.usuario.login(this.loginForm.value).then(() => {
        /*
        // Como hacer una funcion personalizable
        let callback = this.navParams.get('callback');
        if (callback) {
          callback();
        }
        */

      }).catch(error => {
        
        error.logLevel = 'error';
        this.error.handle(error);
      })
    } else {
      this.error.handle({text: 'Debe completar todos los campos.'});
    }
  }

  listenToLoginEvents() {
    
    if (this.usuario.estaLogueado()){
      const paginasApliadas = window.history.length;
      this.events.publish(UsuarioProvider.EVENT_USUARIO_DESLOGUEADO);
      for (let i=0 ; i < paginasApliadas ; i++) {
        window.history.go(-1);
      }
    }
  }

  ionViewDidLoad() {
    setTimeout(() => {

      //Las siguientes cuatro lineas son necesarias para que se pueda dar enter sobre el formulario cuando se viene
      //desde el sistema viejo
      let form = document.getElementById("form");
      var e1 = document.createEvent('MouseEvents');
      e1.initEvent('mousedown', true, true);
      form.dispatchEvent(e1);

      //foco en el input del username
      //this.usernameInput.setFocus();
    }, 500);

  }

  registerClicked() {
    this.navCtrl.push('SignUpPage').catch(error => {
      this.error.handle({error: error, logLevel: 'error'});
    })
  }

  passRecoverClicked() {
    let alert = this.alertCtrl.create({
      title: 'Ingrese su email',
      message: 'Se enviará un enlace para reestablecer su contraseña a su dirección de email',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Recuperar contraseña',
          handler: data => {
            this.usuario.recoverPass(data.email).then(() => {
              this.mensaje.presentar(
                'Recuperar contraseña',
                'Se le enviará un email con las instrucciones para reestablecer su contraseña.',
                {
                  buttons: [ 
                    {
                      text: 'Ok',
                      handler: data => {setTimeout(() => {alert.dismiss()}, 200)}
                    }
                    ]
                });
            }).catch(error => {
              this.error.handle({text: error.text});
            });
            return false;
          }
        }
      ]
    });

    alert.present();
  }


  goCartelera() {
    this.navCtrl.setRoot(CARTELERA_PAGE);
  }

  ionViewDidEnter() {
    this.listenToLoginEvents();
  }
}
