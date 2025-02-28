export const findLocationByLatLng = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAiJcdzN4rB0UB5zfqjMSMMacOSzvcTNzg`
      );
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const { results } = await response.json();
      return extractCity(results[0]?.address_components || []);
    } catch (error) {
      console.error('Error fetching reverse geocode:', error.message);
      throw error;
    }
  };
  
  interface AddressComponent {
    long_name: string;
    types: string[];
  }
  
  const extractCity = (components: AddressComponent[]): string =>
    components.find(({ types }) => types.includes('locality'))?.long_name ||
    components.find(({ types }) => types.includes('administrative_area_level_3'))?.long_name ||
    components.find(({ types }) => types.includes('administrative_area_level_2'))?.long_name ||
    '';
  