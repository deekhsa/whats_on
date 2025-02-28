import { defineStore } from 'pinia';

interface Location {
  city: string | null;
  lat: string | null;
  lng: string | null
}

export const useLocation = defineStore('location', {
  state: (): Location => ({
    city: null,
    lat: null,
    lng: null
  }),
  actions: {
    updateCity(city: string | null) {
      this.city = city;
    },
    updateLatLng(lat: any, lng: any){
      this.lat = lat;
      this.lng = lng;
    }
  },
});
