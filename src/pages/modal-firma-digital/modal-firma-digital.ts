import {Component, ViewChild} from '@angular/core';
import { IonicPage , LoadingController ,NavController , ViewController , NavParams, AlertController} from 'ionic-angular';
import {ErrorProvider, VentaProvider , UsuarioProvider , MensajeProvider} from "../../providers/providers";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';




@IonicPage()
@Component({
  selector: 'modal-firma-digital',
  templateUrl: 'modal-firma-digital.html'
})

export class ModalFirmaDigitalPage {

@ViewChild(SignaturePad) signaturePad: SignaturePad;



operacionId : number;
tieneFirma: boolean;



constructor(public loadingCtrl : LoadingController,
            public navCtrl : NavController,
            public alertCtrl: AlertController,
            public venta : VentaProvider,
            public error : ErrorProvider,
            public usuario : UsuarioProvider,
            public viewCtrl : ViewController,
            public mensaje : MensajeProvider,
            public navParms : NavParams
            ) {

      this.operacionId = this.navParms.get('operacionId');
      this.tieneFirma = false;
  
}

  ionViewDidLoad() {

  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    const anchoContenedor = document.getElementById('contenedor-firma').clientWidth -2;
    const altoContenedor = document.getElementById('contenedor-firma').clientHeight -2;
    this.signaturePad.set('canvasWidth',anchoContenedor);
    this.signaturePad.set('canvasHeight',altoContenedor)
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  rehacerFirma() {
    this.signaturePad.clear();
    this.tieneFirma = false;
  }

  guardarFirma() {
    if (!this.tieneFirma) {
      this.error.handle({text : 'Debe realizar una firma antes de registrarla.'});
    } else {
      const imgBase64 = this.signaturePad.toDataURL().replace('data:image/png;base64,','');
      const operacionId = this.operacionId;
      let loading = this.loadingCtrl.create();
      loading.present();
  
      this.venta.registrarFirmaDigital(operacionId,imgBase64).then(() => {
        loading.dismissAll();
        this.alertFirmaDigitalExitosa();
      }).catch(error => {
        loading.dismissAll();
        error.loglevel = 'error';
        this.error.handle(error);
      })
    }
  }

  drawStart() {
    this.tieneFirma = true;
  }

  alertFirmaDigitalExitosa() {
    let alert = this.alertCtrl.create({
      title : 'Firma registrada.',
      subTitle : 'Se ha registrado la firma exitosamente.',
      buttons : [
        {text : 'Aceptar' , handler : () => {} }
      ]  
    })

    alert.onWillDismiss(() => {
      this.viewCtrl.dismiss();
    })

    alert.present();
  }



}