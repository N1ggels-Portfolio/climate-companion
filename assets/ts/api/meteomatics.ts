import axios from "axios";
import { getToken } from "../auth/auth";
import { getLocation } from "./opencagedata";
import { ref } from "vue";

export async function getData(inputValue: Ref<string>) {
  try {
    const token = await getToken(); // Token for ajax call
    const locationInfo = await getLocation(inputValue) as any; // Get location information
    const location = ref('');
    const info = ref([]);

    if (locationInfo.components.city) {
      location.value = locationInfo.components.city;
    } else if (locationInfo.components.village) {
      location.value = locationInfo.components.village;
    } else if (locationInfo.components.town) {
      location.value = locationInfo.components.town;
    } else if (locationInfo.formatted) {
      location.value = locationInfo.formatted;
    }
    
    const lat = `${locationInfo.geometry.lat}`;
    const lng = `${locationInfo.geometry.lng}`;
    const timeSpan = createTimeSpan();
    const interval = 1; // Output time interval in hours

    const url = `https://api.meteomatics.com/${timeSpan}:PT${interval}H/t_2m:C,precip_1h:mm,wind_speed_10m:ms,weather_symbol_${interval}h:idx/${lat},${lng}/json?model=mix&access_token=${token}`;

    const { data } = await axios.get(url);
    const weatherCast = data.data;
    const temp = weatherCast[0].coordinates[0].dates;
    const precip = weatherCast[1].coordinates[0].dates;
    const wind = weatherCast[2].coordinates[0].dates;
    const condition = weatherCast[3].coordinates[0].dates;


    // Create a new array to save all corresponding values together
    info.value = temp.map((data: any, index: any) => ({
      temp: data,
      precip: precip[index],
      wind: wind[index],
      condition: condition[index]
    }));

    return { location, info };
  } catch (error) {
    console.error('There has beem a problem with your request: ', error)
  }

  // Create the timespan for the api call
  function createTimeSpan(): string {
    // Get the current date and time
    const now = new Date();

    // Calculate the start time (last 0 hours)
    const startTime = new Date(now.getTime() - 0 * 60 * 60 * 1000);
    // Format the start time
    const formattedStartTime = startTime.toISOString().slice(0, 19).replace('T', 'T') + 'Z';

    // Calculate the end time
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Format the end time
    const formattedEndTime = endTime.toISOString().slice(0, 19).replace('T', 'T') + 'Z';

    // Create the URL string
    return `${formattedStartTime}--${formattedEndTime}`;
  }
}