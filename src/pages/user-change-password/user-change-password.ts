import { INGRESO_PUNTO_VENTA_PAGE } from './../pages';
import { MensajeProvider } from './../../app/shared/providers/mensaje/mensaje';
import { ErrorProvider } from './../../providers/error/error';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/providers';

/**
 * Generated class for the UserChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-change-password',
  templateUrl: 'user-change-password.html',
})
export class UserChangePasswordPage {

  private changePasswordForm: FormGroup;

  @ViewChild('oldPasswordInput') oldPasswordInput;

  constructor(private navCtrl: NavController,
              private usuario: UsuarioProvider,
              private error: ErrorProvider,
              private loadingCtrl: LoadingController,
              private mensaje: MensajeProvider,
              private formBuilder: FormBuilder) {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      repeated_new_password: ['', Validators.compose([Validators.required, UserChangePasswordPage.areEqual])],
    });
  }

  static areEqual(control: AbstractControl) {
    let valid = true;
    if(control.parent) {
      
      let parentGroup = control.parent;

      if(control.value != parentGroup.controls['new_password'].value) {
        valid = false;
      }
    }
    return valid ? null : {areEqual: true};
  }

  ionViewDidLoad() {
    setTimeout(() => {

      //foco en el input del username
      this.oldPasswordInput.setFocus();
    }, 500);

  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.usuario.changePassword(this.changePasswordForm.value).then(() => {
        loading.dismissAll();
        this.mensaje.presentar(
          'Cambio de contraseña éxitoso',
          'Ahora puede ingresar a nuestro sistema con su nueva constraseña',
          {
            buttons: ['Ok']
          });
        this.changePasswordForm.reset();
        
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    } else {
      this.error.handle({text: 'Hay errores en el formulario de actualización de clave.'});
    }

  }

  salirClicked() {
    this.navCtrl.pop();
  }

}
