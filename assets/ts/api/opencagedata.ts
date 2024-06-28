import axios from 'axios';

export async function getLocation(address: Ref<string>): Promise<string | null> {
  // These environment variables are prefixed with VITE_ to make them available on the client side.
  // Make sure to replace API_KEY with actual values in your .env file.
  const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
  let transformed;
  
  if (address.value) {
    // Replace ', ' with '%2C+'
    transformed = address.value.replace(/,\s+/g, '%2C+');
  
    // Replace all remaining spaces with '+'
    transformed = transformed.replace(/\s+/g, '+');    
    } else {
    // Replace ', ' with '%2C+'
    transformed = address.replace(/,\s+/g, '%2C+');
  
    // Replace all remaining spaces with '+'
    transformed = transformed.replace(/\s+/g, '+');
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${transformed}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    } else {
      console.error('Location not found!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching location: ', error);
    return null;
  }
}
