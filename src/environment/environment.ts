export const environment = {
  debug: false,
  apiConfig: {
    backend: {
      __url: 'https://www.ticketway.com.ar/twn/be/',
      _url: 'http://192.168.1.37/',
      url: 'http://192.168.1.15/twn/be/',

    },
    linkPago: {
      _url: 'http://192.168.1.37:8100/#/link-pago/',
      url: 'http://192.168.1.15/#/link-pago/',
      __url: 'https://www.ticketway.com.ar/twn/app/#/link-pago/',
    }
  },
  AuthorizationQueryParameterName: 'Authorization',
  version: '1.1.5v'
};
