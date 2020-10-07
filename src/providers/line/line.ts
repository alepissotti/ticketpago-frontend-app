import {Injectable} from '@angular/core';

@Injectable()
export class LineProvider {

    constructor() {

    }

    getBodyRequestLineAuthorizationWeb(params : any) {
        const token = {
            IdentificadorCliente: params.IdentificadorCliente ?params.IdentificadorCliente :null,
            CanalVenta: "WEB",
            TerminalSistema: "TERM001",
            TerminalTipo: "VIRTUAL",
            CodigoEmisor: params.CodigoEmisor ?params.CodigoEmisor :null,
            ModoIngreso: "WEB",
            Moneda: "ARS",
            NumeroTarjeta: params.NumeroTarjeta ?params.NumeroTarjeta :null,
            FechaExpiracion: params.FechaExpiracion ?params.FechaExpiracion :null,
            CodigoSeguridad: params.CodigoSeguridad ?params.CodigoSeguridad :null,
            TarjetaTipo: params.TarjetaTipo ?params.TarjetaTipo :null,
            TipoDocumento: params.TipoDocumento ?params.TipoDocumento :null,
            DocumentoTitular: params.DocumentoTitular ?params.DocumentoTitular :null,
            NombreTitular: params.NombreTitular ?params.NombreTitular :null,
            EmailTitular: params.EmailTitular ?params.EmailTitular :null,
            Referencia: "TicketPago",
            Detalle: [
            {
            NumeroComercio: params.NumeroComercio ?params.NumeroComercio :null,
            Importe: params.Importe ?params.Importe :null,
            Cuotas: params.Cuotas ?params.Cuotas :null,
            IdentificadorCliente: params.IdentificadorCliente ?params.IdentificadorCliente :null,
            Referencia: "TicketPago"
            } ]
        }
        return token;
    }
}