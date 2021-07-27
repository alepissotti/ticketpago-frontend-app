import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController , AlertController} from 'ionic-angular';
import {VentaProvider , ErrorProvider , UsuarioProvider} from '../../providers/providers';
import * as $ from 'jquery'



@IonicPage()
@Component({
  selector: 'medios-ticket-pago',
  templateUrl: 'medios-ticket-pago.html'
})

export class MediosTicketPagoPage {

  ventaReservada : any;
  mediosDePago : any;
  urlEcommerce : any;
  transaccionTerceroId : any;
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

  @ViewChild('cardNumberInput') cardNumberInput;

  constructor(public venta : VentaProvider,
              public usuario : UsuarioProvider,
              public navCtrl : NavController,
              public navParams : NavParams,
              public error : ErrorProvider,
              public loadingCtrl : LoadingController,
              public alertCtrl : AlertController) {
                
                this.ventaReservada = this.venta.getVentaReservada();
                this.mediosDePago = this.navParams.get('mediosPago');
                this.urlEcommerce = this.navParams.get('urlEcommerce');
                this.transaccionTerceroId = this.navParams.get('transaccionTerceroId');

                
                this.cardData = {};
                this.auxCardData = {};
                this.currentYear = new Date().getUTCFullYear();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.usuario.getDatosParaRegistro().then(response => {
      this.selectTipoDni = response.data.tipos_documento;
      this.tipoDocumento = "DNI";
    }).catch(error => {
      window.open(this.urlEcommerce + this.setParams("ERROR"), '_self');
      
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
      if (this.cardNumberInput) {
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


  setParams(estado : string) {
    const params = btoa(`${this.transaccionTerceroId}->${estado}`);
    return params.toString();
  }

        //Funcion para retornar al e-commerce en caso  de que se cancele la venta
        alertVolver() {
          let alert = this.alertCtrl.create({
            title: 'Volver a ' + this.usuario.getPuntoVenta().nombre,
            subTitle: 'Esta seguro que desea cancelar la venta?',
            buttons: [{
              text: 'Cancelar',
              handler: () => {
              }
            },
            {
              text: 'Aceptar',
              handler: async() => {
                let loading = this.loadingCtrl.create();
                loading.present();
                await this.venta.cancelarVentaReservada();
                await this.usuario.logoutUsuario();
                window.open(this.urlEcommerce + this.setParams("CANCELADO"), '_self');
              }
            }]
          });
          alert.present();
        }

        alertFinalizar() {
          let alert = this.alertCtrl.create({
            title: 'Compra Aprobada',
            subTitle: `La compra se ha registrado correctamente. ${this.usuario.getPuntoVenta().nombre} agradece su compra.`,
            buttons: [
            {
              text: 'OK',
              handler: () => {
                this.usuario.logoutUsuario();
                window.open(this.urlEcommerce + this.setParams("APROBADO") , '_self');
              }
            }]
          });
          alert.present();
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
      this.venta.pagar(this.selectedCuota, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.selectedPlan.necesita_autorizacion ? this.cardData : null, this.mailComprobante ? this.mailComprobante : null).then(() => {
      loading.dismissAll();
      if (this.esVentaConTarjeta()) {
        window.open(this.urlEcommerce + this.setParams
          (this.ventaReservada.operacion.operacion_medios_pago[0].operacion_medio_pago_autorizacion.estado_autorizacion) 
          , '_self');
      }
      else this.alertFinalizar();


      
        }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    }
  }

  esVentaConTarjeta() {

    let esVentaConTarjeta = false;

    if(this.ventaReservada && this.ventaReservada.operacion.operacion_medios_pago[0].operacion_medio_pago_autorizacion) {
      esVentaConTarjeta = true;
    }
    return esVentaConTarjeta;
  }

}