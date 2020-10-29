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
anchoContenedor : number;
altoContenedor : number;



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
    this.anchoContenedor = document.getElementById('contenedor-firma').clientWidth -2;
    this.altoContenedor = document.getElementById('contenedor-firma').clientHeight -2;
    this.signaturePad.set('canvasWidth',this.anchoContenedor);
    this.signaturePad.set('canvasHeight',this.altoContenedor)
    this.signaturePad.clear();
  }
 
  rehacerFirma() {
    this.signaturePad.clear();
    this.tieneFirma = false;
  }

  guardarFirma() {
    if (!this.tieneFirma) {
      this.error.handle({text : 'Debe realizar una firma antes de registrarla.'});
    } else {
      let loading = this.loadingCtrl.create();
      loading.present();
      const operacionId = this.operacionId;
      const anchoResize = this.anchoContenedor * 0.4;
      const altoResize = this.altoContenedor * 0.4;
      this.resizeImagen(this.signaturePad.toDataURL(),anchoResize,altoResize).then(response => {
        this.venta.registrarFirmaDigital(operacionId,response.toString()).then(() => {
          loading.dismissAll();
          this.alertFirmaDigitalExitosa();
        }).catch(error => {
          loading.dismissAll();
          error.loglevel = 'error';
          this.error.handle(error);
        })
      }).catch(error => {
        loading.dismissAll();
        this.error.handle({text : 'Hubo un error al registrar la firma. Intente nuevamente.'})
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

  resizeImagen(base64Str: string, maxWidth: number, maxHeight: number) {
    return new Promise((resolve) => {
      let img = new Image()
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')
        const MAX_WIDTH = maxWidth
        const MAX_HEIGHT = maxHeight
        let width = img.width
        let height = img.height
  
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL().replace('data:image/png;base64,',''))
      }
    })
  }



}