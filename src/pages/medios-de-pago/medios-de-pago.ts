import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController , AlertController, ModalController} from 'ionic-angular';
import {ErrorProvider, VentaProvider, PrinterProvider, UsuarioProvider} from "../../providers/providers";
import {VENTA_FINALIZADA_PAGE, MODAL_FIRMA_DIGITAL_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";
import * as $ from 'jquery'

@IonicPage()
@Component({
  selector: 'page-medios-de-pago',
  templateUrl: 'medios-de-pago.html',
})
export class MediosDePagoPage {


  consentimiento: boolean = false;
  loading: boolean;
  message: string;
  ventaReservada: any;
  mediosDePago: any[];
  selectedMedio: any;
  selectedPlan: any;
  selectedCuota: any;
  cardData: any;
  auxCardData: any;
  currentYear: number;
  ventaTelefonica: boolean;
  mailComprobante: any;
  showResumen: boolean;
  selectTipoDni: any[];
  nroDocumento: number;
  tipoDocumento: string;
  mesVencimiento: number;
  anioVencimiento: number;
  cobranzaCuentaTercero: boolean;
  enviarDatos: boolean = false;

  @ViewChild('cardNumberInput') cardNumberInput;

  constructor(private navCtrl: NavController,
              private error: ErrorProvider,
              private venta: VentaProvider,
              private printer: PrinterProvider,
              public user: UsuarioProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl : AlertController,
              private modalCtrl: ModalController,
              private mensaje: MensajeProvider,
              public events: Events) {
    this.ventaReservada = this.venta.getVentaReservada();
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
    this.cardData = {};
    this.auxCardData = {};
    this.currentYear = new Date().getUTCFullYear();
    this.mediosDePago = [];
    this.showResumen = true;
    this.cobranzaCuentaTercero = this.ventaReservada.operacion.operacion_funcion_sectores[0].espectaculo.cobranza_cuenta_tercero;
  }

  ionViewDidLoad() {
    this.getMediosDePagoDisponibles();
  }

  ionViewDidEnter() {
    if (this.enviarDatos) {
      this.navCtrl.pop();
    } else {
      this.user.getDatosParaRegistro().then(response => {
        this.selectTipoDni = response.data.tipos_documento;
        this.tipoDocumento = "DNI";
      }).catch(error => {
        error.logLevel = 'error';
        this.error.handle(error);
        this.navCtrl.pop();
      })
    }
  }

  checkFields() {
    this.cardData.card_number = $("#card_number > input")[0].value;
    this.auxCardData.vencimiento = $("#vencimiento > input")[0].value;
    this.cardData.card_holder_name = $("#card_holder_name > input")[0].value; 
  }

  getMediosDePagoDisponibles() {
    this.loading = true;
    this.venta.getMediosDePagoDisponibles().then(response => {
      this.mediosDePago = response;
      this.message = (this.mediosDePago.length) ? 'Seleccione el medio de pago:' : 'No hay medios de pago disponibles';
      this.loading = false;
      if (!this.mailComprobante) this.focusMailComprobante();
    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
      this.error.handle(error);
    })
    this.ventaTelefonica = this.user.getUser().punto_venta.venta_telefonica;
  }

  selectedMedioChanged() {
    this.selectedCuota = null;
    this.selectedPlan = null;
    if (this.selectedMedio.planes.length == 1) {
      this.selectedPlan = this.selectedMedio.planes[0];
      if (this.selectedPlan.plan_cuotas.length == 1) {
        this.selectedCuota = this.selectedPlan.plan_cuotas[0].id;
        if (this.selectedPlan && this.selectedPlan.necesita_autorizacion) {
          this.focusCardNumberInput();
        }
      }
    }
  }

  selectedPlanChanged() {
    this.selectedCuota = null;
    if (this.selectedPlan && this.selectedPlan.plan_cuotas.length == 1) {
      this.selectedCuota = this.selectedPlan.plan_cuotas[0].id;
      if (this.selectedPlan && this.selectedPlan.necesita_autorizacion) {
        this.focusCardNumberInput();
      }
    }
  }

  focusCardNumberInput() {
    setTimeout(() => {
      if (this.cardNumberInput && !this.cardData.card_number) {
        this.cardNumberInput.setFocus();
      }
    }, 300)
  }




  pagarClicked() {
    if (this.isFormValid()) {
      if (this.selectedPlan.necesita_autorizacion) {
        this.cardData.card_expiration_month = this.auxCardData.vencimiento.substring(0,2);
        this.cardData.card_expiration_year = this.auxCardData.vencimiento.substring(2);
        let cardHolderIdentification = {type: this.tipoDocumento, number: this.nroDocumento};
        this.cardData.card_holder_identification = cardHolderIdentification;
        if( this.user.isPuntoDeVentaOnline() ) {
          this.cardData.email = this.user.getEmail();
        }
        if(this.mailComprobante) {
          this.cardData.email = this.mailComprobante;
        }
      }
      this.showResumen = false;
      const nombre_gateway = (this.selectedPlan.necesita_autorizacion === true) ?this.selectedPlan.nombre_gateway :'DECIDIR';
      switch (nombre_gateway) {
        
        case 'LINE' : {
          this.pagarConLine();
          break;
        }

        default : {
          this.pagarConDecidir();
          break;
        }
      }

    }
  }

    /* Función para armar un objeto con los datos ingresados por el usuario, posteriomente este objeto 
  se utilizara como parámetro en line.getBodyRequestLineAuthorizationWeb() para asignar los datos
  necesarios para armar el json de la request de pago de Line. Este json es enviado al backend con la variable token.
  */
 asignarDatosTokenLine() {
  const params = {
   CodigoEmisor: this.selectedPlan.nombre_tarjeta_line,
   NumeroTarjeta: this.cardData.card_number.toString(),
   FechaExpiracion: this.getFechaExpiracionTarjeta(),
   CodigoSeguridad: this.cardData.security_code.toString(),
   TarjetaTipo: this.selectedPlan.tipo_tarjeta_line,
   TipoDocumento: this.tipoDocumento,
   DocumentoTitular: this.nroDocumento.toString(),
   NombreTitular: this.cardData.card_holder_name,
   EmailTitular: this.mailComprobante,
   NumeroComercio: this.selectedPlan.comercio_id,
   Cuotas: this.getCantidadDeCuotas() ?this.getCantidadDeCuotas() :null,

  }
  return params;
}


getCantidadDeCuotas() {
 let planCuotas = this.selectedPlan.plan_cuotas;
return parseInt(planCuotas.filter(planCuota => planCuota.id === this.selectedCuota )[0].cuotas);

}

getUtimos4DigitosTarjeta() {
  let numeroTarjeta = this.cardData.card_number.toString();
  let largoTarjeta = numeroTarjeta.length;
  return parseInt(numeroTarjeta.substr( largoTarjeta - 4, 4) );
}

getFechaExpiracionTarjeta() {
 const añoVencimiento = this.auxCardData.vencimiento.substring(2);
 const mesVenciminto = this.auxCardData.vencimiento.substring(0,2);
 const fechaExpiracion = añoVencimiento.toString() + mesVenciminto.toString();
 return fechaExpiracion;
}

alertError(error : String) {
  const errorMensaje = error.split('.');
  const titulo = (errorMensaje[0]) ?errorMensaje[0] :'ERROR';
  const subtitulo = (errorMensaje[1]) ?errorMensaje[1] :'No se ha autorizado el pago.';

  let alert = this.alertCtrl.create({
    title : titulo,
    subTitle : subtitulo,
    buttons: [
      {
        text : 'Aceptar',
        handler : () => {}
      }
    ]
  });
  alert.present();
  alert.onDidDismiss( () => {

  });
 }

pagarConDecidir() {
  let loading = this.loadingCtrl.create();
  loading.present();
  
  this.venta.pagar(this.selectedCuota, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.selectedPlan.necesita_autorizacion ? this.cardData : null, this.mailComprobante ? this.mailComprobante : null).then(() => {
    loading.dismissAll();
    this.alertVentaFinalizada();
    }).catch(error => {
    this.showResumen = true;
    loading.dismissAll();
    this.alertError(error.text);
  })
}

  pagarConLine() {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.pagarLineWeb(this.selectedCuota,this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.asignarDatosTokenLine() ,this.mailComprobante ? this.mailComprobante : null, this.getUtimos4DigitosTarjeta()).then(() => {
      loading.dismissAll();
      this.alertVentaFinalizada();
      }).catch(error => {
      this.showResumen = true;
      loading.dismissAll();
      this.alertError(error.text);
    })
  }

  modalFirmaDigital() {
    if (this.user.necesitaFirmaDigital() ) {
      const operacionId = this.venta.getOperacionId();

      let modalFirmaDigital = this.modalCtrl.create(MODAL_FIRMA_DIGITAL_PAGE,{
        operacionId : operacionId
      },{enableBackdropDismiss : false})
  
      modalFirmaDigital.onWillDismiss(() => {
        this.navCtrl.push(VENTA_FINALIZADA_PAGE).then(() => {
        this.enviarDatos = true;
        });
      
        if (this.cobranzaCuentaTercero) {
        const operacionId = this.venta.getOperacionId().toString();
        this.venta.imprimirComprobanteVentaCuentaTercerosGet(this.user, 
                                            {'operacionesIds': operacionId , 'loteId' : null});
        }
      })

      modalFirmaDigital.present();
    } else {
        this.navCtrl.push(VENTA_FINALIZADA_PAGE).then(() => {
        this.enviarDatos = true;
        });
      
        if (this.cobranzaCuentaTercero) {
        const operacionId = this.venta.getOperacionId().toString();
        this.venta.imprimirComprobanteVentaCuentaTercerosGet(this.user, 
                                            {'operacionesIds': operacionId , 'loteId' : null});
        }  
      }

  }

  alertVentaFinalizada() {
    let alert = this.alertCtrl.create({
      title : 'Operación exitosa',
      subTitle : 'El pago ha sido autorizado.',
      buttons : [{text : 'Aceptar' , handler : () => {} }]
    })

    alert.onWillDismiss( () => {
      this.modalFirmaDigital();
    })

    alert.present();
  }

  isFormValid(): boolean {
    if( ((this.ventaTelefonica && this.ventaReservada.operacion.operacion_envio)
          ||
        (!this.user.isPuntoDeVentaOnline() && this.selectedPlan && this.selectedPlan.necesita_autorizacion)) && !this.mailComprobante ) {
      this.error.handle({text: 'Debe ingresar un email para poder enviar comprobante de compra'});
      return false;
    }
    if (!this.selectedCuota) {
      this.error.handle({text: 'Debe seleccionar un medio de pago.'});
      return false;
    }
    if (this.selectedPlan.necesita_autorizacion) {
      if (!this.cardData.card_number) {
        this.error.handle({text: 'Debe ingresar el número de la tarjeta.'});
        return false;
      }
      if (!this.auxCardData.vencimiento) {
        this.error.handle({text: 'Debe ingresar la fecha de vencimiento de la tarjeta.'});
        return false;
      }
      if(this.auxCardData.vencimiento.length != 4) {
        this.error.handle({text: 'Verifique que la fecha de vencimiento sea la correcta, siendo dos números para el mes y dos para el año.'});
        return false;
      }
      if (!this.cardData.security_code) {
        this.error.handle({text: 'Debe ingresar el número de seguridad de la tarjeta.'});
        return false;
      }
      if (!this.cardData.card_holder_name) {
        this.error.handle({text: 'Debe ingresar el nombre del titular tal como figura en la tarjeta.'});
        return false;
      }
      if (!this.tipoDocumento) {
        this.error.handle({text: 'Debe ingresar el tipo de documento del titular de la tarjeta.'});
        return false;
      }
      if (!this.nroDocumento) {
        this.error.handle({text: 'Debe ingresar el número de documento del titular de la tarjeta.'});
        return false;
      }
    }
    return true;
  }

  //Alerts de los inputs para dispositivos moviles
  focusMailComprobante() {
    const mailComprobante = (this.mailComprobante) ?this.mailComprobante.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Email comprobante',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.mailComprobante = alertData.mailComprobante;
      } }
      ],
      inputs : [
        {type : 'email' , name : 'mailComprobante' , value : mailComprobante }
      ]
    })

    alert.onWillDismiss(() => {});

    setTimeout(() => {
      alert.present();
    },500)
  }

  focusNumeroTarjeta() {
    const card_number = (this.cardData.card_number) ?this.cardData.card_number.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Número de la tarjeta',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.cardData.card_number = (alertData.card_number) ?alertData.card_number :null;
        if (!this.auxCardData.vencimiento) this.focusVencimientoTarjeta();
      } }
      ],
      inputs : [
        {type : 'number' , name : 'card_number' , value : card_number }
      ]
    })
  
    alert.onWillDismiss(() => {});
    
    setTimeout(() => {
      alert.present();
    },500)
  }

  focusVencimientoTarjeta() {
    const vencimiento = (this.auxCardData.vencimiento) ?this.auxCardData.vencimiento.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Vencimiento de la tarjeta (MMAA)',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.auxCardData.vencimiento = (alertData.vencimiento) ?alertData.vencimiento :null;
        if(!this.cardData.card_holder_name) this.focusTitularTarjeta();
      } }
      ],
      inputs : [
        {type : 'number' ,  name : 'vencimiento' , value : vencimiento }
      ]
    })
  
    alert.onWillDismiss(() => {});
    
    setTimeout(() => {
      alert.present();
    },500)
  }

  focusTitularTarjeta() {
    const titularTarjeta = (this.cardData.card_holder_name) ?this.cardData.card_holder_name.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Nombre del dueño de la tarjeta',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.cardData.card_holder_name = alertData.titularTarjeta;
        if(!this.cardData.security_code) this.focusCodigoSeguridad();
      } }
      ],
      inputs : [
        {type : 'text' ,  name : 'titularTarjeta' , value : titularTarjeta }
      ]
    })
  
    alert.onWillDismiss(() => {});
    
    setTimeout(() => {
      alert.present();
    },500)
  }

  focusCodigoSeguridad() {
    const codigoSeguridad = (this.cardData.security_code) ?this.cardData.security_code.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Código de seguridad de la tarjeta',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.cardData.security_code = (alertData.codigoSeguridad) ?alertData.codigoSeguridad :null;
        if (!this.nroDocumento) this.focusDniTitular();
      } }
      ],
      inputs : [
        {type : 'password' ,  name : 'codigoSeguridad' , value : codigoSeguridad }
      ]
    })
  
    alert.onWillDismiss(() => {});
    
    setTimeout(() => {
      alert.present();
    },500)
  }

  focusDniTitular() {
    const documentoTitular = (this.nroDocumento) ?this.nroDocumento.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Número de documento',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.nroDocumento = (alertData.documentoTitular) ?alertData.documentoTitular :null;
      } }
      ],
      inputs : [
        {type : 'number' ,  name : 'documentoTitular' , value : documentoTitular }
      ]
    })
  
    alert.onWillDismiss(() => {});
  
  
    setTimeout(() => {
      alert.present();
    },500)
  }
}



