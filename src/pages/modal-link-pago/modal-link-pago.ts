import {Component} from '@angular/core';
import { IonicPage , LoadingController ,NavController , ViewController , NavParams} from 'ionic-angular';
import {ErrorProvider, VentaProvider , UsuarioProvider , MensajeProvider} from "../../providers/providers";




@IonicPage()
@Component({
  selector: 'modal-link-pago',
  templateUrl: 'modal-link-pago.html'
})

export class ModalLinkPagoPage {


url : string;
urlCopiada : boolean = false;


constructor(public loadingCtrl : LoadingController,
            public navCtrl : NavController,
            public venta : VentaProvider,
            public error : ErrorProvider,
            public usuario : UsuarioProvider,
            public viewCtrl : ViewController,
            public mensaje : MensajeProvider,
            public navParms : NavParams
            ) {

              this.url = this.navParms.get('linkPago');
  
}

  ionViewDidLoad() {

  }

  copiarUrl() {
    var aux = document.createElement("input");
    aux.setAttribute("value",this.url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    document.getElementById("botonCopiar").innerHTML = "Copiado";
    document.getElementById("botonCopiar").style.backgroundColor = "blue";
    this.urlCopiada = true;
  }

  salir() {
    this.viewCtrl.dismiss();
  }

  compartirUrl() {
    let newVariable: any;

    newVariable = window.navigator;

    if (newVariable && newVariable.share) {
      newVariable.share({
        title: 'TicketPago',
        text: `Link de pago - ${this.usuario.getPuntoVenta().nombre}`,
        url: this.url.toString(),
      })
        .then(() => {this.urlCopiada = true})
        .catch((error) => {
          error.loglevel = 'error';
          this.error.handle(error);
        });
    } else {
      this.mensaje.presentar(null,'Solo permitido para dispositivos móviles.', null, 3000)
    }
  }
}