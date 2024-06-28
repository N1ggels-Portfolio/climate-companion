export async function getToken(): Promise<string> {
  // These environment variables are prefixed with VITE_ to make them available on the client side.
  // Make sure to replace USERNAME and PASSWORD with actual values in your .env file.
  const username = import.meta.env.VITE_METEOMATICS_USERNAME;
  const password = import.meta.env.VITE_METEOMATICS_PASSWORD;
  let headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  return fetch('https://login.meteomatics.com/api/v1/token', {
    method: 'GET', 
    headers: headers
  })
  .then(function(response) {
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    return response.json();
  })
  .then(function(data) {
    const token = data.access_token;
    return token;
  })
  .catch(function(error) {
    console.log('Something went wrong', error)
  });
}