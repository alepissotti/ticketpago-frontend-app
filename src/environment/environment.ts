export const environment = {
  debug: false,
  apiConfig: {
    backend: {
      url: 'https://www.ticketway.com.ar/twn/be/',
      _url: 'http://192.168.1.37/',
      __url: 'http://192.168.1.15/twn/be/',

    },
    linkPago: {
      _url: 'http://192.168.1.37:8100/#/link-pago/',
      __url: 'http://192.168.1.15/#/link-pago/',
      url: 'https://www.ticketway.com.ar/twn/app/#/link-pago/',
    }
  },
  AuthorizationQueryParameterName: 'Authorization',
  version: '1.0.1v'
};
