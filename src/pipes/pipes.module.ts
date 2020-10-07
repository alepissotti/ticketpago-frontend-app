import {NgModule} from '@angular/core';
import {BaseUrlPipe} from './base-url/base-url';
import { BuscadorTituloEspectaculoPipe } from './buscador-titulo-espectaculo/buscador-titulo-espectaculo';
import { OrdenadorEspectaculosPipe } from './ordenador-espectaculos/ordenador-espectaculos';
import { BuscadorLocalidadEspectaculoPipe } from './buscador-localidad-espectaculo/buscador-localidad-espectaculo';
import { TiempoRestanteVentaPipe } from './tiempo-restante-venta/tiempo-restante-venta';
import { FiltroPuntoVentaPipe } from './filtro-punto-venta/filtro-punto-venta';
import { SafeHtmlPipe } from './safe-html/safe-html';
import { FiltroLocalidadSegunCodigoPostalPipe } from './filtro-localidad-segun-codigo-postal/filtro-localidad-segun-codigo-postal';

@NgModule({
  declarations: [BaseUrlPipe,
    BuscadorTituloEspectaculoPipe,
    OrdenadorEspectaculosPipe,
    BuscadorLocalidadEspectaculoPipe,
    TiempoRestanteVentaPipe,
    FiltroLocalidadSegunCodigoPostalPipe,
    FiltroPuntoVentaPipe,
    SafeHtmlPipe],
  imports: [],
  exports: [BaseUrlPipe,
    BuscadorTituloEspectaculoPipe,
    OrdenadorEspectaculosPipe,
    BuscadorLocalidadEspectaculoPipe,
    TiempoRestanteVentaPipe,
    FiltroLocalidadSegunCodigoPostalPipe,
    FiltroPuntoVentaPipe,
    SafeHtmlPipe],
})
export class PipesModule {

}
