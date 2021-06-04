import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, AlertController , NavParams, LoadingController} from 'ionic-angular';
import {VentaProvider , ErrorProvider , UsuarioProvider} from '../../providers/providers';
import * as $ from 'jquery'



@IonicPage()
@Component({
  selector: 'ticket-pago',
  templateUrl: 'ticket-pago.html'
})

export class TicketPagoPage {

    @ViewChild('emailInput') emailInput;
    @ViewChild('numeroTarjetaInput') numeroTarjetaInput;
    @ViewChild('vencimientoInput') vencimientoInput;
    @ViewChild('duenioTarjetaInput') duenioTarjetaInput;
    @ViewChild('codigoSeguridadInput') codigoSeguridadInput;

    datos : any;
    errorString : string = 'Error de comunicación con Ticketpago, por favor intente nuevamente.';
    codigoRespuestaExitosa: number = 1;
    codigoRespuestaCancelada: number = 2;
    codigoRespuestaError: number = 3;
    
    //Obligatorios
    usernameLogin: any;
    passwordLogin: any;
    empresaId: any;
    transaccionID: any;
    total: any;
    urlPagina: any;
    //Opcionales
    nombreCliente: any;
    medioPago: any;
    numeroTarjeta: any;
    vencimientoTarjeta: any;
    cuotas: any;
    email: any;

    loading: boolean;
    mediosPagoDisponibles: any[]
    selectedMedioPago: any;
    selectedPlan: any;
    selectedCuota: any;

    medioPagoReadOnly: boolean;
    planReadOnly: boolean;
    planCuotaReadOnly: boolean;

    cardData: any;
    auxCardData: any;
    currentYear: number;

    selectTipoDni: any[];
    nroDocumento: number;
    tipoDocumento: string;

 

    constructor(public venta : VentaProvider,
                public usuario : UsuarioProvider,
                public error : ErrorProvider,
                public alertCtrl : AlertController,
                public loadingCtrl: LoadingController,
                public navCtrl : NavController,
                public navParams : NavParams) {             
          
        this.cardData = {}
        this.auxCardData = {}
        this.currentYear = new Date().getUTCFullYear();

        this.loading= true;
        this.datos = navParams.get('datos');
        this.setParametros();        
    
    }

    ionViewDidLoad() {
      this.validarParametros();
    }

    ionViewDidEnter() {
      this.usuario.getDatosParaRegistro().then(response => {
        this.selectTipoDni = response.data.tipos_documento;
        this.tipoDocumento = "DNI";
      }).catch(() => {
        window.open(this.urlPagina + this.getResponseToUrl(this.errorString,this.codigoRespuestaError), '_self');
        
      })
  
    }

    //Setear parametros con los datos enviados por el usuario
    setParametros() {
      if (this.datos) {
        //Obligatorios
        this.usernameLogin = this.datos.usernameLogin;
        this.passwordLogin = this.datos.passwordLogin;
        this.empresaId = this.datos.empresaId;
        this.transaccionID = this.datos.transaccionID;
        this.total = this.datos.total;
        this.urlPagina = this.datos.urlPagina;
        //Opcionales
        this.nombreCliente = this.datos.nombreCliente;
        this.medioPago = this.datos.medioPago;
        this.numeroTarjeta = this.datos.numeroTarjeta;
        this.vencimientoTarjeta = this.datos.vencimientoTarjeta;
        this.cuotas = this.datos.cuotas;
        this.email = this.datos.email;

        Object.assign(this.cardData, {card_number : this.numeroTarjeta});
        Object.assign(this.cardData, {card_holder_name: this.nombreCliente});
        Object.assign(this.auxCardData, {vencimiento: this.vencimientoTarjeta});
      }
    }

    checkFields() {
      this.cardData.card_number = $("#card_number > input")[0].value;
      this.auxCardData.vencimiento = $("#vencimiento > input")[0].value;
      this.cardData.card_holder_name = $("#card_holder_name > input")[0].value; 
    }

    //Validacion de que todos los datos obligatorios , si no se devuelve respuesta con error
    validarParametros() {
      let validacion = true;
      //Si hay datos obligatorios que no son enviados -> validacion = false
      if (!this.usernameLogin) validacion = false;
      if (!this.passwordLogin) validacion = false;
      if (!this.empresaId) validacion = false;
      if (!this.transaccionID) validacion = false;
      if (!this.total) validacion = false;
      if (!this.urlPagina) validacion = false;
      
      if (!validacion) window.open(this.urlPagina + this.getResponseToUrl('Faltan datos obligatorios, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
      else this.loginUsuario()

    }

    //Loguear usuario para obtener tokenizacion
    loginUsuario() {
      this.usuario.loginUsuario({username: this.usernameLogin, password: this.passwordLogin})
                  .then(() => {
                    this.getFuncionSector()
                  }).catch(() => {
                    window.open(this.urlPagina + this.getResponseToUrl(this.errorString,this.codigoRespuestaError), '_self');
                  })
    }

    //Obtener la respuesta para enviar al cliente externo
    getResponseToUrl(response: String, codigoRespuesta: number, codigoAutorizacion?, cupon?, totTransaccion? ,carServicioTransaccion? ,tranEstadoNombre? ,fecPago? ,ultCDT? ,nomApeTitular? ,cuo? ,marTarjeta? ,detDocumento? ,nroDocumento?) {
      
      let objResponse = {
        transaccionID: this.transaccionID,
        respuesta: response,
        codigoRespuesta: codigoRespuesta,
        codigoAutorizacion: (!codigoAutorizacion) ?null :codigoAutorizacion,
        cupon: (!cupon) ?null :cupon,
        total_transaccion: (!totTransaccion) ? null : totTransaccion,
        cargo_servicio_transaccion: (!carServicioTransaccion) ? null :carServicioTransaccion,
        transaccion_estado_nombre: (!tranEstadoNombre) ? null : tranEstadoNombre,
        fecha_pago: (!fecPago) ? null : fecPago,
        ultimos_cuatro_digitos_tarjeta: (!ultCDT) ? null : ultCDT,
        nombre_apellido_titular: (!nomApeTitular) ? null : nomApeTitular,
        cuotas: (!cuo) ? null : cuo,
        marca_tarjeta: (!marTarjeta) ? null : marTarjeta,
        detalle_documento: (!detDocumento) ? null : detDocumento,
        nro_documento: (!nroDocumento) ? null : nroDocumento
      }

      return '?' +  btoa(JSON.stringify(objResponse) );
    }

    //Obtener FuncionSector para registrar venta en curso
    getFuncionSector() {
      this.venta.getEspectaculosDisponibles().then(response => {
        const espectaculos = response.espectaculos_disponibles;
        const empresa = espectaculos.filter(espectaculo => espectaculo.id == this.empresaId)[0];
        const funcionSector = (!empresa) ?null :empresa.first_funcion_sector;
        const funcionSectorId = (!funcionSector) ?null :funcionSector.id;
        this.tieneTransaccionIdentica(funcionSectorId)
      }).catch(() => {
        window.open(this.urlPagina + this.getResponseToUrl(this.errorString,this.codigoRespuestaError), '_self');
      })
    }

    //ConsultarTransaccionTercero
    consultarTransaccionTercero(): any {
      this.venta.consultarTransaccionTercero(this.empresaId,this.transaccionID).then(response => {
        return response
      }).catch(() => {
        return null;
      })
    }

    //Para saber previo a registrar la venta en curso, si la empresa tiene una transaccion previa con mismo Id
    tieneTransaccionIdentica(funcionSectorId) {
      if (funcionSectorId) {
        this.venta.tieneTransaccionIdentica(funcionSectorId,this.transaccionID).then(response => {
          if (!response.tiene_transaccion_identica) {
            this.registrarVentaEnCurso(funcionSectorId);
          } else {
            window.open(this.urlPagina + this.getResponseToUrl('Ya existe una operación con es Id, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
          }
        }).catch(() => {
          window.open(this.urlPagina + this.getResponseToUrl('Ya existe una operación con es Id, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
        })
      } else {
        window.open(this.urlPagina + this.getResponseToUrl(this.errorString,this.codigoRespuestaError), '_self');
      }
    }
    
    //Registrar Venta en Curso
    registrarVentaEnCurso(funcionSectorId) {
      this.venta.registrarVentaEnCurso(funcionSectorId,1,true,this.total,0,[],this.transaccionID)
                .then(() => {
                  this.registrarEnvio()
                }).catch(() => {
                  window.open(this.urlPagina + this.getResponseToUrl('Hubo un error al intentar registrar la operación, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
                })
    }

    //Registrar Envio con la configuración para despachos
    registrarEnvio() {
      this.venta.registrarEnvio
      (null,1,this.usuario.getPuntoVenta().id,true,[]).then(() => {
        this.getMediosDePagoDisponibles()
      }).catch(async () => {
        await this.venta.cancelarVentaReservada();
        window.open(this.urlPagina + this.getResponseToUrl(this.errorString,this.codigoRespuestaError), '_self');
      });
    }
    
    //Obtener los medios de pago disponibles
    getMediosDePagoDisponibles() {
      this.venta.getMediosDePagoDisponibles(this.medioPago).then(response => {
        this.mediosPagoDisponibles = response;
        this.setMedioPago();
      }).catch(async () => {
        await this.venta.cancelarVentaReservada();
        window.open(this.urlPagina + this.getResponseToUrl('Hubo un error al intentar obtener los medios de pago disponibles, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
      })
    }

    async setMedioPago() {
      if (this.mediosPagoDisponibles) {
        this.mediosPagoDisponibles.forEach(medioPago => {
            let planes = medioPago.planes
            planes.forEach(plan => {
              if (plan.contiene_medio_pago_tarjeta_request) {
                this.selectedMedioPago = medioPago;
                this.selectedPlan = plan;
                this.medioPagoReadOnly = this.planReadOnly = true;
                this.setCuota();
              }
            });
        });
        if (this.envioMedioPago() && !this.selectedMedioPago) {
          await this.venta.cancelarVentaReservada();
          window.open(this.urlPagina + this.getResponseToUrl('El medio de pago enviado no existe o no se encuentra disponible, por favor intente nuevamente',this.codigoRespuestaError), '_self');
        } 
      }
      this.loading= false;
      this.setFocusInput();
    }

    async setCuota() {
      if (this.selectedPlan) {
        let cuotas = this.selectedPlan.plan_cuotas;
        cuotas.forEach(cuota => {
          if (cuota.cuotas == this.cuotas) {
            this.selectedCuota = cuota;
            this.planCuotaReadOnly = true;
          }
        });
        if (this.envioCuota() && !this.selectedCuota) {
          await this.venta.cancelarVentaReservada();
          window.open(this.urlPagina + this.getResponseToUrl('El número de cuotas enviado no existe o no se encuentra disponible, por favor intente nuevamente.',this.codigoRespuestaError), '_self');
        }
      }
    }

    setFocusInput() {
      if (!this.envioEmail() && !this.email) {
        this.setEmailInputFocus();
        return;
      }
      if (!this.envioNumeroDeTarjeta() && !this.cardData.card_number && this.selectedCuota) {
        this.setNumeroTarjetaInputFocus();
        return;
      }
      if (!this.envioVencimiento() && !this.auxCardData.vencimiento && this.selectedCuota) {
        this.setVencimientoInputFocus();
        return;
      }
      if (!this.envioCliente() && !this.cardData.card_holder_name && this.selectedCuota) {
        this.setDuenioTarjetaInputFocus();
        return;
      }
      if (this.selectedCuota) {
        this.setCodigoSeguridadInputFocus();
        return;
      }
    }

    setEmailInputFocus() {
      setTimeout(() => {
        this.emailInput.setFocus();
      },500)
    }

    setNumeroTarjetaInputFocus() {
      setTimeout(() => {
        this.numeroTarjetaInput.setFocus();
      },500)
    }

    setVencimientoInputFocus() {
      setTimeout(() => {
        this.vencimientoInput.setFocus();
      },500)
    }

    setDuenioTarjetaInputFocus() {
      setTimeout(() => {
        this.duenioTarjetaInput.setFocus();
      },500)
    }

    setCodigoSeguridadInputFocus() {
      setTimeout(() => {
        this.codigoSeguridadInput.setFocus();
      },500)
    }

    selectedMedioChanged() {
      this.selectedCuota = null;
      this.selectedPlan = null;
      if (this.selectedMedioPago.planes.length == 1) {
        this.selectedPlan = this.selectedMedioPago.planes[0];
        if (this.selectedPlan.plan_cuotas.length == 1) {
          this.selectedCuota = this.selectedPlan.plan_cuotas[0].id;
          this.setFocusInput();
        }
      }
    }
  
    selectedPlanChanged() {
      this.selectedCuota = null;
      if (this.selectedPlan && this.selectedPlan.plan_cuotas.length == 1) {
        this.selectedCuota = this.selectedPlan.plan_cuotas[0].id;
        this.setFocusInput();
      }
    }


    envioEmail() {
      if (!this.datos) return false;
      if (!this.datos.email) return false;
      return true;
    }

    envioNumeroDeTarjeta() {
      if (!this.datos) return false;
      if (!this.datos.numeroTarjeta) return false;
      return true;
    }

    envioVencimiento() {
      if (!this.datos) return false;
      if (!this.datos.vencimientoTarjeta) return false;
      return true;
    }

    envioMedioPago() {
      if (!this.datos) return false;
      if (!this.datos.medioPago) return false;
      return true;
    }

    envioCuota() {
      if (!this.datos) return false;
      if (!this.datos.cuotas) return false;
      return true;
    }

    envioCliente() {
      if (!this.datos) return false;
      if (!this.datos.nombreCliente) return false;
      return true;
    }


  alertVolver() {
    let alert = this.alertCtrl.create({
      title: 'Volver a ' + this.usuario.getPuntoVenta().nombre,
      subTitle: 'Esta seguro que desea cancelar la venta?',
      buttons: [{
        text: 'Cancelar',
        handler: () => {}
      },
      {
        text: 'Aceptar',
        handler: async() => {
          let loading = this.loadingCtrl.create();
          loading.present();
          await this.venta.cancelarVentaReservada();
          window.open(this.urlPagina + this.getResponseToUrl('La operación ha sido cancelada.',this.codigoRespuestaCancelada), '_self');
        }
      }
      ]
    })
    alert.present();
  }

  isFormValid(): boolean {
    if(!this.email ) {
      this.error.handle({text: 'Debe ingresar un email para poder enviar comprobante de compra.'});
      return false;
    }
    if (!this.selectedMedioPago) {
      this.error.handle({text: 'Debe seleccionar un medio de pago.'});
      return false;
    }
    if (!this.selectedPlan) {
      this.error.handle({text: 'Debe seleccionar un plan de pago.'});
      return false;
    }
    if (!this.selectedCuota) {
      this.error.handle({text: 'Debe seleccionar la cantidad de cuotas.'});
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

  pagarClicked() {
    if (this.isFormValid() ) {
      if (this.selectedPlan.necesita_autorizacion) {
        this.cardData.card_expiration_month = this.auxCardData.vencimiento.substring(0,2);
        this.cardData.card_expiration_year = this.auxCardData.vencimiento.substring(2);
        let cardHolderIdentification = {type: this.tipoDocumento, number: this.nroDocumento};
        this.cardData.card_holder_identification = cardHolderIdentification;
        if( this.usuario.isPuntoDeVentaOnline() ) {
          this.cardData.email = this.usuario.getEmail();
        }
        if(this.email) {
          this.cardData.email = this.email;
        }
      }
      const nombre_gateway = (this.selectedPlan.necesita_autorizacion === true) ?this.selectedPlan.nombre_gateway :'DECIDIR';
      const cuotaId = (this.envioCuota() && this.selectedCuota) ?this.selectedCuota.id :this.selectedCuota
      switch (nombre_gateway) {
        
        case 'LINE' : {
          this.pagarConLine(cuotaId);
          break;
        }

        default : {
          this.pagarConDecidir(cuotaId);
          break;
        }
      }
    }
  }

  pagarConLine(cuotaId) {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.pagarLineWeb(cuotaId,this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.asignarDatosTokenLine() ,this.email ? this.email : null, this.getUtimos4DigitosTarjeta()).then(() => {
      loading.dismissAll();
      this.alertVentaFinalizada();
      }).catch(error => {
      loading.dismissAll();
      this.alertError(error.text);
    })
  }

  pagarConDecidir(cuotaId) {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.pagar(cuotaId, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.key : null, this.selectedPlan.necesita_autorizacion ? this.selectedPlan.url_sps : null, this.selectedPlan.necesita_autorizacion ? this.cardData : null, this.email ? this.email : null).then(response => {
      loading.dismissAll();
      this.alertVentaFinalizada();
      }).catch(error => {
      loading.dismissAll();
      this.alertError(error.text);
    })
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
   EmailTitular: this.email,
   NumeroComercio: this.selectedPlan.comercio_id,
   Cuotas: this.getCantidadDeCuotas() ?this.getCantidadDeCuotas() :null,

  }
  return params;
}

getCantidadDeCuotas() {
  let planCuotas = this.selectedPlan.plan_cuotas;
  const cuota = (this.envioCuota() && this.selectedCuota) ?this.selectedCuota.id :this.selectedCuota;
  let cuotas;
  planCuotas.forEach(planCuota => {
    if (planCuota.id == cuota) cuotas = planCuota.cuotas
  });
  return cuotas
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

  alertVentaFinalizada() {
    let alert = this.alertCtrl.create({
      title : 'Operación exitosa',
      subTitle : 'El pago ha sido autorizado.',
      buttons : [{text : 'Aceptar' , handler : () => {} }]
    })

    alert.onWillDismiss( () => {
      let loading = this.loadingCtrl.create();
      loading.present()
      this.venta.consultarTransaccionTercero(this.empresaId,this.transaccionID).then(response => {
        loading.dismissAll();
        const codAutorizacion = (!response[0]) ?null :response[0].codigo_autorizacion;
        const cupon = (!response[0]) ?null :response[0].cupon;
        const totTransaccion = (!response[0]) ?null :response[0].total_transaccion;
        const carServicioTransaccion = (!response[0]) ?null :response[0].cargo_servicio_transaccion;
        const tranEstadoNombre = (!response[0]) ?null :response[0].transaccion_estado_nombre;
        const fecPago = (!response[0]) ?null :response[0].fecha_pago;
        const ultCDT = (!response[0]) ?null :response[0].ultimos_cuatro_digitos_tarjeta;
        const nomApeTitular = (!response[0]) ?null :response[0].nombre_apellido_titular;
        const cuo = (!response[0]) ?null :response[0].cuotas;
        const marTarjeta = (!response[0]) ?null :response[0].marca_tarjeta ;
        const detDocumento = (!response[0]) ?null: response[0].detalle_documento;
        const nroDocumento = (!response[0]) ?null : response[0].nro_documento;

        window.open(this.urlPagina + this.getResponseToUrl('La operación ha sido aprobada.',this.codigoRespuestaExitosa,codAutorizacion,cupon,totTransaccion,carServicioTransaccion,tranEstadoNombre,fecPago,ultCDT,nomApeTitular,cuo,marTarjeta,detDocumento,nroDocumento), '_self');
      }).catch(() => {
        loading.dismissAll();
        window.open(this.urlPagina + this.getResponseToUrl('La operación ha sido aprobada.',this.codigoRespuestaExitosa), '_self');
      })
      //window.open(this.urlPagina + this.getResponseToUrl('La operación ha sido aprobada.',this.codigoRespuestaExitosa), '_self');
    })

    alert.present();
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

 


    
}