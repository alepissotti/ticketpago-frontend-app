import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController , AlertController , ViewController} from 'ionic-angular';
import {VentaProvider , ErrorProvider , UsuarioProvider} from '../../providers/providers';
import * as $ from 'jquery'



@IonicPage()
@Component({
  selector: 'medios-link-pago',
  templateUrl: 'medios-link-pago.html'
})

export class MediosLinkPagoPage {

  mediosDePago : any;
  mailComprobante : any;
  selectedMedio : any;
  selectedPlan : any;
  selectedCuota : any;
  cardData: any;
  auxCardData: any;
  currentYear: number;
  selectTipoDni: any[];
  nroDocumento: number;
  tipoDocumento: string;
  mesVencimiento: number;
  anioVencimiento: number;
  operacionId: number;
  montoOperacion: number;

  @ViewChild('cardNumberInput') cardNumberInput;

  constructor(public venta : VentaProvider,
              public usuario : UsuarioProvider,
              public navCtrl : NavController,
              public navParams : NavParams,
              public error : ErrorProvider,
              public loadingCtrl : LoadingController,
              public alertCtrl : AlertController,
              public viewCtrl : ViewController) {
                
                this.mediosDePago = this.navParams.get('mediosDePago');
                this.operacionId = this.navParams.get('operacionId');
                this.montoOperacion = this.navParams.get('montoOperacion');                
                this.cardData = {};
                this.auxCardData = {};
                this.currentYear = new Date().getUTCFullYear();
                this.venta.operacionId = this.operacionId;
  }

  ionViewDidLoad() {
    if (!this.mailComprobante) this.focusMailComprobante();
  }

  ionViewDidEnter() {
    this.usuario.getDatosParaRegistro().then(response => {
      this.selectTipoDni = response.data.tipos_documento;
      this.tipoDocumento = "DNI";
    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
      this.navCtrl.pop();
      
    })

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

  checkFields() {
    this.cardData.card_number = $("#card_number > input")[0].value;
    this.auxCardData.vencimiento = $("#vencimiento > input")[0].value;
    this.cardData.card_holder_name = $("#card_holder_name > input")[0].value; 
  }

  
  esEnteroPositivo(variable) {
    const expresion= new RegExp(/^\d*$/);
    return ( (variable === null) || (expresion.test(variable)) )
  }

  isFormValid(): boolean {
    if(!this.mailComprobante ) {
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
      if (!this.esEnteroPositivo(this.auxCardData.vencimiento)) {
        this.error.handle({text: 'El vencimiento de la tarjeta no es correcto, Formato: MMAA'});
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


  alertCancelar() {
   let alert = this.alertCtrl.create({
     title: 'Cancelar operación',
     subTitle: `Esta seguro de cancelar la operación? 
     Si oprime aceptar la operación será cancelada, y este link ya no tendrá vigencia para realizar el pago. `,
     buttons: [{
       text: 'Cancelar',
       handler: () => {
      }
     },
     {
       text: 'Aceptar',
       handler: () => {
        this.cancelarOperacion();
       }
     }]
   });
   alert.present();
  }

  cancelarOperacion() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.venta.cancelarVentaLinkPago(this.operacionId).then(() => {
      loading.dismissAll();
      this.navCtrl.getPrevious().data.cancelada = true;
      this.navCtrl.pop();
    }).catch(error => {
      loading.dismissAll();
      error.logLevel='error';
      this.error.handle(error);
    })
  }

  alertFinalizar() {
    let alert = this.alertCtrl.create({
      title: 'Compra Aprobada',
      subTitle: `La compra se ha registrado correctamente. ${this.usuario.getPuntoVenta().nombre} agradece su compra.`,
      buttons: [
      {
        text: 'Aceptar',
        handler: () => {
        
        }
      }]
    });
    alert.present();
    alert.onDidDismiss(() => {
      this.navCtrl.pop();
    })
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
  

  pagarClicked() {
    if (this.isFormValid()) {
      let loading = this.loadingCtrl.create();
      loading.present();
      if (this.selectedPlan.necesita_autorizacion) {
        this.cardData.card_expiration_month = this.auxCardData.vencimiento.substring(0,2);
        this.cardData.card_expiration_year = this.auxCardData.vencimiento.substring(2);
        let cardHolderIdentification = {type: this.tipoDocumento, number: this.nroDocumento};
        this.cardData.card_holder_identification = cardHolderIdentification;
        this.cardData.email = this.mailComprobante;

      }
      
      const operacionId = this.operacionId;
      const puntoVentaId = this.usuario.getPuntoVenta().id;
      const limiteLinkPago = this.usuario.getPuntoVenta().limite_link_pago;

      this.venta.consultarOperacionLinkPago(operacionId,puntoVentaId,limiteLinkPago).then(response => {
        const operacion = response[0];
        if (!operacion) {
          loading.dismissAll();
          this.navCtrl.pop();
        } else {
            const nombre_gateway = (this.selectedPlan.necesita_autorizacion === true) ?this.selectedPlan.nombre_gateway :'DECIDIR';
            switch (nombre_gateway) {
              case 'LINE': {
                this.venta.pagarLineWeb(this.selectedCuota,this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.asignarDatosTokenLine() ,this.mailComprobante ? this.mailComprobante : null, this.getUtimos4DigitosTarjeta()).then(() => {
                  loading.dismissAll();
                  this.alertFinalizar();
                }).catch(error => {
                    loading.dismissAll();
                    this.alertError(error.text);
                  })
                break;
              }
              default : {
                this.venta.pagar(this.selectedCuota, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.selectedPlan.necesita_autorizacion ? this.cardData : null, this.mailComprobante ? this.mailComprobante : null).then(() => {
                  loading.dismissAll();
                  this.alertFinalizar();
                  }).catch(error => {
                    loading.dismissAll();
                    this.alertError(error.text);
                  })
                break;
              }
            }
        }
      })
      .catch(error => {
       loading.dismissAll();
       error.logLevel = 'error';
       this.error.handle(error);
      })
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