import {Component, SimpleChanges} from '@angular/core';

/**
 * Generated class for the Espectaculos_3ColumnasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'espectaculos-3-columnas',
  templateUrl: 'espectaculos-3-columnas.html',
  inputs: ['espectaculos']
})
export class Espectaculos_3ColumnasComponent {

  espectaculos: any;

  espectaculoColumna1: any[];
  espectaculoColumna2: any[];
  espectaculoColumna3: any[];
  espectaculoColumna4: any[];


  constructor() {
    this.espectaculoColumna1 = [];
    this.espectaculoColumna2 = [];
    this.espectaculoColumna3 = [];
    this.espectaculoColumna4 = [];

    this.formatearColumnas(this.espectaculos);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formatearColumnas(this.espectaculos);
  }

  formatearColumnas = (espectaculos) => {

    let contador = 1;

    this.espectaculoColumna1 = [];
    this.espectaculoColumna2 = [];
    this.espectaculoColumna3 = [];
    this.espectaculoColumna4 = [];



    if(espectaculos) {
      espectaculos.forEach((espectaculo) => {
        console.log(contador);
        if (contador % 4 == 1) {
          this.espectaculoColumna1.push(espectaculo);
        }
        if (contador % 4 == 2) {
          this.espectaculoColumna2.push(espectaculo);
        }
        if (contador % 4 == 3) {
          this.espectaculoColumna3.push(espectaculo);
        }
        if (contador % 4 == 0) {
          this.espectaculoColumna4.push(espectaculo);
        }

        contador++;
      })
    }

  }

}
