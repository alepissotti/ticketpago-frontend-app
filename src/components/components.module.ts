import { SearchableTipoEnvioComponent } from './searchable-tipo-envio/searchable-tipo-envio';
import { CardInfoEspectaculoCarteleraComponent } from './card-info-espectaculo-cartelera/card-info-espectaculo-cartelera';
import { CommonPageFooter } from './common-page-footer/common-page-footer';
import { SearchablePuntoVentaComponent } from './searchable-punto-venta/searchable-punto-venta';
import { SharedModule } from './../app/shared/shared.module';
import { ListadoFuncionSectoresComponent } from './listado-funcion-sectores/listado-funcion-sectores';
import { ListadoFuncionesComponent } from './listado-funciones/listado-funciones';
import { SearchableOperacionComponent } from './searchable-operacion/searchable-operacion';
import { SelectorSalidaReporteComponent } from './selector-salida-reporte/selector-salida-reporte';
import { SearchableFuncionComponent } from './searchable-funcion/searchable-funcion';
import { SearchableEspectaculoComponent } from './searchable-espectaculo/searchable-espectaculo';
import { SearchableLoteOperacionEnvioEstadoComponent } from './searchable-lote-operacion-envio-estado/searchable-lote-operacion-envio-estado';
import {NgModule} from '@angular/core';
import {ResumenVentaComponent} from './resumen-venta/resumen-venta';
import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {CancelarVentaComponent} from "./cancelar-venta/cancelar-venta";
import { DatosEstablecimientoComponent } from './datos-establecimiento/datos-establecimiento';
import { FuncionDetalleComponent } from './funcion-detalle/funcion-detalle';
import { ListadoEspectaculosDisponiblesComponent } from './listado-espectaculos-disponibles/listado-espectaculos-disponibles';
import {PipesModule} from "../pipes/pipes.module";
import {NgCircleProgressModule} from "ng-circle-progress";
import { SelectorLocalidadComponent } from './selector-localidad/selector-localidad';
import { Espectaculos_3ColumnasComponent } from './espectaculos-3-columnas/espectaculos-3-columnas';
import { SideMenuComponent } from './side-menu/side-menu';
import { SideMenuContentComponent } from './side-menu-content/side-menu-content.component';

@NgModule({
  declarations: [ResumenVentaComponent, CancelarVentaComponent,
    CardInfoEspectaculoCarteleraComponent,
    CommonPageFooter,
    DatosEstablecimientoComponent,
    FuncionDetalleComponent,
    ListadoEspectaculosDisponiblesComponent,
    ListadoFuncionesComponent,
    ListadoFuncionSectoresComponent,
    SelectorLocalidadComponent,
    Espectaculos_3ColumnasComponent,
    SearchableEspectaculoComponent,
    SearchableFuncionComponent,
    SearchableLoteOperacionEnvioEstadoComponent,
    SearchableOperacionComponent,
    SearchablePuntoVentaComponent,
    SearchableTipoEnvioComponent,
    SelectorSalidaReporteComponent,
    SideMenuComponent,
    SideMenuContentComponent,
    ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    SharedModule,
    NgCircleProgressModule.forRoot({
      radius: 21,
      outerStrokeWidth: 4,
      outerStrokeColor: "#f53d3d",
      animationDuration: 300,
      percent: 0,
      showUnits: false,
      showSubtitle: false,
      showBackground: false,
      innerStrokeColor: "#C7E596",
      innerStrokeWidth: 4,
      space: -4
    }),
  ],
  exports: [ResumenVentaComponent, CancelarVentaComponent,
    CardInfoEspectaculoCarteleraComponent,
    CommonPageFooter,
    DatosEstablecimientoComponent,
    FuncionDetalleComponent,
    ListadoEspectaculosDisponiblesComponent,
    ListadoFuncionesComponent,
    ListadoFuncionSectoresComponent,
    SelectorLocalidadComponent,
    Espectaculos_3ColumnasComponent,
    SearchableEspectaculoComponent,
    SearchableFuncionComponent,
    SearchableLoteOperacionEnvioEstadoComponent,
    SearchableOperacionComponent,
    SearchablePuntoVentaComponent,
    SearchableTipoEnvioComponent,
    SelectorSalidaReporteComponent,
    SideMenuComponent,
    SideMenuContentComponent,
  ],
})
export class ComponentsModule {
}
