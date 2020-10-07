import { DireccionProvider } from './../../providers/direccion/direccion';
import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsuarioProvider} from "../../providers/usuario/usuario";
import {MEDIOS_DE_PAGO_PAGE, MENU_VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage({
  defaultHistory: [MENU_VENTA_PAGE]
})
@Component({
  selector: 'page-envio',
  templateUrl: 'envio.html',
})
export class EnvioPage {

  private direccionForm: FormGroup;
  private personaForm: FormGroup;
  private eTicketForm: FormGroup;
  loading: boolean;
  loadingDisplay: any;
  message: string;
  ventaReservada: any;
  envios: any[];
  selectedEnvio: any;
  loadingPaises: boolean;
  paisesOptions: Array<any>;
  loadingProvincias: boolean;
  provinciasOptions: Array<any>;
  loadingLocalidades: boolean;
  localidadesOptions: Array<any>;
  argentinaId: number = 13;
  direccion: any;
  asignarDireccionDefault: boolean;
  puntosVenta: Array<any>;
  selectedPuntoVenta: any;
  ventaTelefonica: boolean;
  showResumen: boolean;
  personasETicket: Array<any>;
  puntoVentaId : any;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              public direccionProvider: DireccionProvider,
              private error: ErrorProvider,
              private venta: VentaProvider,
              private user: UsuarioProvider,
              public events: Events,
              private mensaje: MensajeProvider,
              private formBuilder: FormBuilder) {
    this.ventaReservada = this.venta.getVentaReservada();
    
    this.validarVentaValida();
    this.inicializarFormularioDireccion();
    this.inicializarFormularioPersona();
    this.showResumen = true;

  }

  validarVentaValida() {
    if (!this.ventaReservada || !this.ventaReservada.operacion) {
      this.error.handle({text: 'Hubo un error al cargar su venta. Intente nuevamente más tarde.'});
      this.navCtrl.pop().catch(error => {
        this.error.handle({error: error, logLevel: 'error'});
      })
    }
  }

  inicializarFormularioDireccion() {
    this.direccionForm = this.formBuilder.group({
      pais: [null, Validators.required],
      provincia: [null, Validators.required],
      provincia_inexistente: [{value: null, disabled: true}, Validators.required],
      localidad: [null, Validators.required],
      localidad_inexistente: [{value: null, disabled: true}, Validators.required],
      localidad_inexistente_cod_postal: [{value: null, disabled: true}, Validators.required],
      calle: [null, Validators.required],
      altura: [null, Validators.required],
      piso: [null],
      departamento: [null]
    });

    this.loadingPaises = false;
    this.paisesOptions = [];
    this.loadingProvincias = false;
    this.provinciasOptions = [];
    this.loadingLocalidades = false;
    this.localidadesOptions = [];
    this.asignarDireccionDefault = false;
  }

  addEmptyFieldsDatosSector(persona) {
    const control = <FormArray>this.eTicketForm.controls.persona;
    control.push(this.inicializarDatosPersonasForm(persona));
  }

  inicializarDatosPersonasForm(persona = {nombre: '', apellido: '', dni: ''}): FormGroup {
    return this.formBuilder.group({
      nombre: [ persona.nombre,
        Validators.compose([Validators.maxLength(100), Validators.required]),
      ],
      apellido: [ persona.apellido,
        Validators.compose([Validators.maxLength(100), Validators.required]),
      ],
      dni: [ persona.dni,
        Validators.compose([Validators.maxLength(100), Validators.required]),
      ]
    });
  }

  inicializarFormularioPersona() {
    this.personaForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      nro_dni: [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create();
    loader.present();

    /*checkeamos si es posible la selección de ETickets*/
    this.personasETicket = [];
    
    this.ventaReservada.operacion.operacion_funcion_sectores.forEach((funcionSector) => {
      
      funcionSector.ubicaciones.forEach((ubicacion) => {
        this.personasETicket.push({ "nombreFuncionSector": funcionSector.nombre_sector, 
                                    "nombres": '', 
                                    "apellido": '', 
                                    "dni": '',
                                    "ubicacionId": ubicacion.id,
                                    "detalleUbicacion": ubicacion.detalle_ubicacion });
      });

    });

    let promises = [];
    promises.push(this.getPaises());
    promises.push(this.getProvincias(this.argentinaId));
    promises.push(this.getPuntosVenta());
    Promise.all(promises).then(() => {
      this.direccionProvider.getDireccion().then(direccion => {
        if (direccion.direccion_envio) {
          this.direccion = direccion.direccion_envio;
        }
      }).catch(error => {
        error.logLevel = 'error';
        this.error.handle(error);
      })

      loader.dismiss();
    }).catch(error => {
      loader.dismiss();
      this.error.handle(error);
    });
    this.ventaTelefonica = this.user.getUser().punto_venta.venta_telefonica;
    
    this.puntoVentaId = this.user.getPuntoVenta().id;
  
  }

  ionViewWillLeave() {
    this.showResumen = false;
  }

  showLoader() {
    this.loadingDisplay = this.loadingCtrl.create({'dismissOnPageChange': true});
    this.loadingDisplay.present();
  }

  hideLoader() {
    if(this.loadingDisplay) {
      this.loadingDisplay.dismissAll();
    }
  }

  getPuntosVenta() {
    this.venta.getPuntosDeVentaParaEnvio().then(response => {
      this.puntosVenta = response;
    }).catch(() => {
      this.getPuntosVenta();
    })
  }

  ionViewCanEnter() {
    return this.getEnviosDisponibles();
  }

  tipoEnvioChanged() {
    this.asignarDireccionDefault = false;
    delete this.selectedPuntoVenta;

    if (this.selectedEnvio && this.selectedEnvio.requiere_direccion) {
      if(!this.direccion) {
        this.asignarDireccionDefault = true;
      }
    }
  }

  getPaises() {
    this.loadingPaises = true;
    this.paisesOptions = [];
    this.direccionProvider.getPaises().then(response => {
      this.paisesOptions = response.paises;
      this.loadingPaises = false;
      this.direccionForm.patchValue({pais: this.argentinaId});
    }).catch(() => {
      this.getPaises();
    })
  }

  getProvincias(id: number) {
    this.loadingProvincias = true;
    this.provinciasOptions = [];
    this.direccionProvider.getProvincias(id).then(response => {
      this.provinciasOptions = response.provincias;
      this.loadingProvincias = false;
    }).catch(() => {
      this.getProvincias(id);
    })
  }

  getLocalidades(id: number) {
    this.loadingLocalidades = true;
    this.localidadesOptions = [];
    this.direccionProvider.getLocalidades(id).then(response => {
      this.localidadesOptions = response.localidades;
      this.loadingLocalidades = false;
    }).catch(() => {
      this.getLocalidades(id);
    })
  }

  paisChanged(paisId) {
    this.direccionForm.controls.provincia.reset();
    this.provinciaChanged(this.direccionForm.value.provincia);
    this.getProvincias(paisId);
  }

  provinciaChanged(provinciaId) {
    this.direccionForm.controls.provincia_inexistente.reset();
    this.direccionForm.controls.localidad.reset();
    if (provinciaId === 0) {
      this.localidadesOptions = [];
      this.direccionForm.controls.provincia_inexistente.enable();
      this.direccionForm.patchValue({localidad: 0});
    } else {
      this.direccionForm.controls.provincia_inexistente.disable();
      this.getLocalidades(provinciaId);
    }
    this.localidadChanged(this.direccionForm.value.localidad);
  }

  localidadChanged(localidadId) {
    this.direccionForm.controls.localidad_inexistente.reset();
    this.direccionForm.controls.localidad_inexistente_cod_postal.reset();
    if (localidadId === 0) {
      this.direccionForm.controls.localidad_inexistente.enable();
      this.direccionForm.controls.localidad_inexistente_cod_postal.enable();
    } else {
      this.direccionForm.controls.localidad_inexistente.disable();
      this.direccionForm.controls.localidad_inexistente_cod_postal.disable();
    }
  }

  getEnviosDisponibles() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.venta.getEnviosDisponibles().then(response => {
        this.envios = response;
        this.message = (this.envios.length) ? 'Seleccione el tipo de envío:' : 'No hay tipos de envío disponibles';
        this.loading = false;
        resolve();
      }).catch(error => {
        this.loading = false;
        error.logLevel = 'error';
        this.error.handle(error);
        reject(error);
      })
    })
  }

  confirmarEnvio() {

    if(this.selectedEnvio) {
      if (this.selectedEnvio.requiere_direccion &&
        (!this.direccion || (this.direccion && this.asignarDireccionDefault))) {
        if (this.direccionForm.valid) {
          this.showLoader();
          this.registrarDireccion().then(() => {
            this.hideLoader();
            this.registrarEnvio();
          }).catch(error => {
            error.logLevel = 'error';
            this.error.handle(error);
            this.hideLoader();
          })
        } else {
          this.hideLoader();
          this.mostrarMensajeError('Datos faltantes', 'Por favor, ingrese todos los datos necesarios para poder realizar el envío. Gracias');
        }
      } else {
        this.registrarEnvio();
      }
    } else {
      this.mostrarMensajeError('Seleccione tipo de envío', 'Por favor, ingrese el tipo de envío para realizar la entrega de las entradas. Gracias');
    }
  }

  mostrarMensajeError(title, message) {
    this.mensaje.presentar(title, message, {buttons: [{text: 'Ok',role: 'Ok'}]});
  }

  registrarDireccion(): Promise<any> {
    return new Promise((resolve, reject) => {
      let dir = Object.assign({}, this.direccionForm.value);
      this.direccionProvider.registrarDireccion(dir).then(direccion => {
        this.direccion = direccion.direccion_envio;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarEnvio() {
    //Si es una venta telefonica puede no tener seleccionado el envio
    let data = this.assembleForm();
    
    if (data) {
      if(data.selectedEnvio) {
        this.showLoader();
        this.venta.registrarEnvio(data.direccion, data.selectedEnvio, data.puntoVentaId, data.asignarDireccionDefault, data.personasETicket).then(() => {
          this.goNextPage();
        }).catch(error => {
          this.hideLoader();
          error.logLevel = 'error';
          this.error.handle(error);
        })
      } else {
        this.goNextPage();
      }
    }

  }

  goNextPage() {
    if(this.ventaTelefonica) {
      if(this.selectedEnvio.id == 0) {
        this.navCtrl.push(MENU_VENTA_PAGE);
      } else {
        if (this.user.puedeReservarOPreimprimir()) {
          this.navCtrl.push(MENU_VENTA_PAGE);
        } else {
          this.navCtrl.push(MEDIOS_DE_PAGO_PAGE);
        }
      }
    } else {
      if (this.user.puedeReservarOPreimprimir()) {
        this.navCtrl.push(MENU_VENTA_PAGE);
      } else {
        this.navCtrl.push(MEDIOS_DE_PAGO_PAGE);
        
      }
    }
  }

  assembleForm() {
    let data: any = {};
    if (!this.selectedEnvio) {
      this.mostrarMensajeError('Seleccione tipo de envío', 'Por favor, ingrese el tipo de envío para realizar la entrega de las entradas. Gracias');
      return false;
    }
    data.selectedEnvio = this.selectedEnvio.id;
    if (this.selectedEnvio.requiere_direccion) {
      if (!this.direccion) {
        this.mostrarMensajeError('Seleccione tipo de envío', 'Por favor, ingrese el tipo de envío para realizar la entrega de las entradas. Gracias');
        return false;
      }
      data.direccion = this.direccion.id;
    }
    if (this.selectedEnvio.requiere_punto_venta) {
      if (!this.selectedPuntoVenta) {
        this.mostrarMensajeError('Seleccione Punto de Venta', 'Por favor, ingrese el punto de venta para realizar la entrega de las entradas. Gracias');
        return false;
      }
      data.puntoVentaId = this.selectedPuntoVenta.id;
    }
    if(this.selectedEnvio.requiere_datos_persona) {
      for (let i = 0; i < this.personasETicket.length; i++) {
        if( this.registroNoValido(this.personasETicket[i].nombres) || this.registroNoValido(this.personasETicket[i].apellido) || this.registroNoValido(this.personasETicket[i].dni)) {
          this.mostrarMensajeError('Datos de personas incompletos', 'Por favor, ingrese los datos de las personas que ingresaran con las entradas. Gracias');
          return false;
        }
      }
      data.personasETicket = this.personasETicket;
    }
    return data;
  }

  private registroNoValido(dato) {
    return !dato || dato == '';
  }

  asignarNuevaDireccion() {
    this.asignarDireccionDefault = !this.asignarDireccionDefault;
  }

}
