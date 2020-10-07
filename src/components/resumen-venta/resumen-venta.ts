import { CancelarVentaComponent } from './../cancelar-venta/cancelar-venta';
import {Component, ViewChild, Input} from '@angular/core';
import {Events,NavParams} from "ionic-angular";
import { TimerProvider } from './provider/timer';
import {VentaProvider} from './../../providers/venta/venta';
import {ErrorProvider} from '../../providers/error/error';

@Component({
  selector: 'resumen-venta',
  templateUrl: 'resumen-venta.html',
  inputs: ['ventaReservada', 'activo','cobranzaCuentaTercero','precioCuentaTercero']
})
export class ResumenVentaComponent {

  @ViewChild('cancelarVenta') cancelarVentaComponent: CancelarVentaComponent;
  @Input() puntoVentaId : any;
  @Input() espectaculoId : any;

  ventaReservada: any;
  tiempoRestante: any;
  funcionSectoresConDiferencial : any;
  loading : boolean = false;

  constructor(
              public events: Events,
              public timer: TimerProvider,
              public venta : VentaProvider,
              public error : ErrorProvider,) {
  
                
  }

  ngOnInit() {
    this.events.subscribe(TimerProvider.EVENT_TIME_FINISHED, () => {this.finalizarVenta()})
    this.cargar();
  }

  cargar() {
    setTimeout( () => {
      const puntoVenta = this.puntoVentaId || this.ventaReservada.operacion.usuario.punto_venta.id;
      const espectaculo = this.espectaculoId || this.ventaReservada.operacion.espectaculo_id  ;
      this.loading = true;
      this.listarDiferencialesPorFuncionSector(espectaculo,puntoVenta);
      return;
    },1000);
  }

  ngOnDestroy() {
    this.events.unsubscribe(TimerProvider.EVENT_TIME_FINISHED);
    this.timer.finalizarTimer();
  }

  inicializar() {
    setTimeout( () => {
      if(this.ventaReservada && this.ventaReservada.operacion && this.ventaReservada.operacion.tiempo_vida_compra_restante) {
        this.timer.inicializar(this.ventaReservada.operacion.tiempo_vida_compra_restante);
      }
    }, 500);
  }

  update = (event) => {
    if(event.cancelado) {
      this.timer.finalizarTimer();
    }
  }

  finalizarVenta() {
    this.cancelarVentaComponent.cancelarClicked();
  }

  //Funcion para obtener los precios y cargos diferenciales segun el espectaculo y punto de venta
  
  listarDiferencialesPorFuncionSector(espectaculoId,puntoVentaId) {
    this.venta.listarFuncionSectoresConDiferencial({espectaculoId,puntoVentaId}).then(response => {
      this.funcionSectoresConDiferencial = response || null;
      
    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle({text: 'Hubo un error. Intente nuevamente más tarde'});
    });
  }

    //Funcion que devuelve el precio diferencial si corresponde
    precioDiferencial(sectorId) {
      if (this.funcionSectoresConDiferencial !=null ) {
      for (let i=0 ; i < this.funcionSectoresConDiferencial.length ; i++) {
        if (this.funcionSectoresConDiferencial[i].funcion_sector_id == sectorId) {
          return this.funcionSectoresConDiferencial[i].precio
        }
      }
    }
      return -1
  }

      //Funcion que devuelve el precio diferencial si corresponde
    cargoDiferencial(sectorId) {
      if (this.funcionSectoresConDiferencial !=null ) {
      for (let i=0 ; i < this.funcionSectoresConDiferencial.length ; i++) {
        if (this.funcionSectoresConDiferencial[i].funcion_sector_id == sectorId) {
          return this.funcionSectoresConDiferencial[i].cargo_servicio
        }
      }
      }
      return -1
    }





  
}
