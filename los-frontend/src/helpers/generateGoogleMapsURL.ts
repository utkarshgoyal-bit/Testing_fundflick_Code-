const  generateGoogleMapsURL = (latitude: string, longitude: string)=> {
    const baseUrl = "https://www.google.com/maps/place/";
    // Build the URL by combining the base URL and dynamic coordinates
    const url = `${baseUrl}${latitude}%2C${longitude}`;
    return url;
}

export default generateGoogleMapsURL