import { Component, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the SelectorLocalidadEspectaculoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selector-salida-reporte',
  templateUrl: 'selector-salida-reporte.html'
})
export class SelectorSalidaReporteComponent {

  static readonly TIPO_SALIDA_PDF_ID: number = 1;
  static readonly TIPO_SALIDA_EXCEL_ID: number = 2;
  static readonly TIPO_SALIDA_HTML_ID: number = 5;

  @Output() tipoSalidaSeleccionado: any = new EventEmitter<any>();;

  tipoSalida: any;

  tipoSalidaPdfSelected: false;
  tipoSalidaHtmlSelected: false;

  valorTipoSalidaExcel = SelectorSalidaReporteComponent.TIPO_SALIDA_EXCEL_ID;
  valorTipoSalidaHTML = SelectorSalidaReporteComponent.TIPO_SALIDA_HTML_ID;
  valorTipoSalidaPdf = SelectorSalidaReporteComponent.TIPO_SALIDA_PDF_ID;

  constructor(public plt: Platform) {
    this.tipoSalida = SelectorSalidaReporteComponent.TIPO_SALIDA_PDF_ID;

    if (this.plt.is('mobileweb')) {
      // This will only print when on iOS
      this.tipoSalida = SelectorSalidaReporteComponent.TIPO_SALIDA_HTML_ID;
    }

    if(this.plt.is('mobile')) {
      this.tipoSalida = SelectorSalidaReporteComponent.TIPO_SALIDA_HTML_ID;
    }
  }

  ngAfterViewInit() {
    this.emitirTipoSalidaSeleccionada();
  }

  updateSeleccion() {
    this.emitirTipoSalidaSeleccionada();
  }

  emitirTipoSalidaSeleccionada() {
    this.tipoSalidaSeleccionado.emit({
      tipoSalida: this.tipoSalida
    });
  }

}
