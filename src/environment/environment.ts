export const environment = {
  debug: false,
  apiConfig: {
    backend: {
      __url: 'https://www.ticketway.com.ar/twn/be/',
      _url: 'http://192.168.1.37/',
      url: 'http://192.168.1.15/twn/be/',

    },
    linkPago: {
      __url: 'http://192.168.1.37:8100/#/link-pago/',
      _url: 'http://192.168.1.15/#/link-pago/',
      url: 'https://www.ticketway.com.ar/twn/app/#/link-pago/',
    }
  },
  AuthorizationQueryParameterName: 'Authorization',
  version: '1.0.6v'
};
