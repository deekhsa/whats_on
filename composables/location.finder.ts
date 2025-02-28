import { ref } from 'vue';
import mitt from 'mitt';

const emitter = mitt();

export const useLocationFinder = () => {
  const isLoading = ref(false);

  // Get the current location
  const getCurrentLocation = () => {
    isLoading.value = true;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        setPosition,
        setError
      );
    } else {
      emitter.emit('error', 'Location services are not supported.');
      isLoading.value = false;
    }
  };

  // Set the location coordinates
  const setPosition = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    try {
      emitter.emit('success', { latitude, longitude });
    } catch (err: any) {
      emitter.emit('error', `Failed to set location coordinates (${err.message})`);
    } finally {
      isLoading.value = false;
    }
  };

  const setError = (err: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred.';

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Permission denied. Go to App Info (or) Browser > Permissions > Enable Location';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case err.TIMEOUT:
        errorMessage = 'The request to get user location timed out.';
        break;
    }

    emitter.emit('error', errorMessage);
    isLoading.value = false;
  };

  return {
    getCurrentLocation,
    isLoading,
    emitter
  };
};
