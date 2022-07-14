// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  //APIS
  URL_SERVICIOS_SEGURIDAD : 'http://192.168.1.119:10264/testmicro_seguridades',
  URL_SERVICIOS_CORREO : 'http://186.47.204.233:8080/micro_sendMail-0.0.1/mail/sendBasic',
  URL_SERVICIOS : 'http://servicios.amt.gob.ec:5001',

  //ID DE APLICACION DE LA BD
  idAplicacion: '225',
  //NOMBRE DE APLICACION
  nombreAplicaion:'INCIDENTES AMT',

  production: false

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
