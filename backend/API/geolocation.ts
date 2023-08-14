import { browser_not_supported, cannot_get_location } from "../util/errors";

/**
 * funzione che ritorna la geolocazione dell'utente
 */
export async function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userlocation = position.coords; //userlocation.latitude userlocation.longitude
        return userlocation;
      },
      (error) => {
        console.log(error);
        return cannot_get_location;
      },
    );
  } else return browser_not_supported;
}
