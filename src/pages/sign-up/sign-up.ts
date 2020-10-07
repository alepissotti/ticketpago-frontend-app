import { CARTELERA_PAGE } from './../pages';
import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorProvider, UsuarioProvider} from "../../providers/providers";
import {LOGIN_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  private signUpForm: FormGroup;
  sexoOptions: Array<any>;
  tipoDniOptions: Array<any>;
  
  @ViewChild('inputEmail') inputEmail: any;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              private loadingCtrl: LoadingController,
              public mensaje: MensajeProvider,
              public usuarioProvider: UsuarioProvider,
              private formBuilder: FormBuilder) {
    this.signUpForm = this.formBuilder.group({
      emails: this.formBuilder.group({
        email: [null, Validators.compose([Validators.required, Validators.email])],
        repeat: [null, Validators.required]
      }, {validator: SignUpPage.areEqual}),
      passwords: this.formBuilder.group({
        password: [null, Validators.required],
        repeat: [null, Validators.required]
      }, {validator: SignUpPage.areEqual}),
      nombres: [null, Validators.required],
      apellido: [null, Validators.required],
      sexo: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      nroDocumento: [null, Validators.required],
      localidad: this.formBuilder.group({
        pais: [null, Validators.required],
        provincia: [null, Validators.required],
        provincia_inexistente: [{value: null, disabled: true}, Validators.required],
        codPostal: [null],
        localidad: [null, Validators.required],
        localidad_inexistente: [{value: null, disabled: true}, Validators.required],
        localidad_inexistente_cod_postal: [{value: null, disabled: true}, Validators.required]
      }),
      calle: [null, Validators.required],
      altura: [null, Validators.required],
      piso: [null],
      departamento: [null],
      telNumero: [null, Validators.required],
      telCaracteristica: [null, Validators.required]
    });
    this.sexoOptions = [{detalle: 'Cargando...'}];
    
  }

  static areEqual(group: FormGroup) {
    let valid = true;
    let val;
    for (let name in group.controls) {
      if (!val) {
        val = group.controls[name].value;
      } else {
        if (val != group.controls[name].value) {
          valid = false;
        }
      }
    }
    return valid ? null : {areEqual: true};
  }

  ionViewDidLoad() {
    this.getDatosParaRegistro();
    
    setTimeout( () => {
      this.inputEmail.setFocus();
    }, 400);
  }

  getDatosParaRegistro() {
    this.usuarioProvider.getDatosParaRegistro().then(response => {
      this.sexoOptions = response.data.sexo;
      this.tipoDniOptions = response.data.tipos_documento;
    }).catch(() => {
      this.getDatosParaRegistro();
    })
  }

  

  signUpSubmit() {
    if (this.signUpForm.valid) {
      let loading = this.loadingCtrl.create();
      loading.present();
      let account = Object.assign({}, this.signUpForm.value);
      account.email = account.emails.email;
      account.plainPassword = {
        first: account.passwords.password,
        second: account.passwords.repeat
      };
      account.pais = account.localidad.pais;
      account.provincia = account.localidad.provincia;
      account.localidad.provincia_inexistente? account.provincia_inexistente = account.localidad.provincia_inexistente: null;
      account.localidad.localidad? account.localidad = account.localidad.localidad: null;
      account.localidad.localidad_inexistente? account.localidad_inexistente = account.localidad.localidad_inexistente: null;
      account.localidad.localidad_inexistente_cod_postal? account.localidad_inexistente_cod_postal = account.localidad.localidad_inexistente_cod_postal: null;
      delete account.emails;
      delete account.passwords;
      this.usuarioProvider.register(account).then(() => {
        loading.dismissAll();
        this.mensaje.presentar(
          'Registro Exitoso!',
          'Para completar el registro debe verificar su correo electrónico.',
          {
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.navCtrl.setRoot(LOGIN_PAGE);
              }
            }]
          }
          );

      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    } else {
      this.error.handle({text: 'Debe completar todos los campos.'});
    }
  }

  goCartelera() {
    this.navCtrl.setRoot(CARTELERA_PAGE);
  }

}
