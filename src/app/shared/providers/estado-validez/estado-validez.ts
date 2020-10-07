import {AlertController} from "ionic-angular";

export class EstadoValidez {

  estadoValido: boolean = true;
  errores: any = []; //listado de strings con los errores encontrados

  constructor(private alertCtrl: AlertController){

  }

  asignarError(stringError) {
    this.estadoValido = false;
    this.errores.push(stringError);
  }

  showAlert() {

    console.log('mostrando alert con errores');
    let mensaje = '';

    for( let i = 0; i < this.errores.length; i++ ) {
      mensaje = mensaje + '<br>' + this.errores[i] + '</br>';
    }

    let alert = this.alertCtrl.create(
      {
        title: 'Existen errores en el formulario',
        message: mensaje,
        enableBackdropDismiss: false,
        buttons: [{
          text: 'Ok'
        }]
      }
    );
    alert.present();
  }

}
