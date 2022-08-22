// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export let environment = {
  applicationNameByUrl      :           null,         
  production                :           false,
  storeData                 :           'assets/store.json',
  storeId                   :           (localStorage.getItem("APPLICATION_NAME_BY_URL") && localStorage.getItem(localStorage.getItem("APPLICATION_NAME_BY_URL")) && JSON.parse(localStorage.getItem(localStorage.getItem("APPLICATION_NAME_BY_URL"))).STORE_ID) || window["env"]["StoreId"]                ||     352,
  buildConfigurationType    :           window["env"]["BuildConfigurationType"] ||    "systemtesting",
  apiBaseUrl                :           (window["env"]["ApiBaseUrl"] && `${window.location.protocol}//${window.location.host}` + window["env"]["ApiBaseUrl"])  || "https://wawbizstores.com/wawbiz-svr/api/ols/",
  clientAppVersionName      :           (localStorage.getItem("APPLICATION_NAME_BY_URL") && localStorage.getItem(localStorage.getItem("APPLICATION_NAME_BY_URL")) && JSON.parse(localStorage.getItem(localStorage.getItem("APPLICATION_NAME_BY_URL"))).CLIENT_APPLICATION_NAME) || window["env"]["ClientAppVersionName"]   ||  "Heavenlyweb-1.0.0",
  clientAppVersionCode      :           window["env"]["ClientAppVersionCode"]   ||    "1",
  googleClientId            :           window["env"]["googleClientId"]         ||     "1014375048959-l0ttn96qnft2rlk6lgjn9fjmk2p79r93.apps.googleusercontent.com",
  facebookClientId          :           window["env"]["FacebookClientId"]       ||    "522289618558002",
  googleMapsKey             :           window["env"]["GoogleMapsKey"]          ||    "AIzaSyA1e7tRKgwCLpZ4TuwdSkecpg4e6hS6LOw",
  

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
