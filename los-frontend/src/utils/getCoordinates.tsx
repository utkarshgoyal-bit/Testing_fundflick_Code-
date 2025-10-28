const GetCoordinates = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    const data = await response.json();
    return {
      addressLine: data.display_name || '',
      city: data.address.city || data.address.town || '',
      state: data.address.state || '',
      country: data.address.country || '',
      pinCode: data.address.postcode || '',
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};
export default GetCoordinates;
