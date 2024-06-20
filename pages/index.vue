<template>
  <main class="main">  
    <section class="section section__cards">
      <div class="card card__location" v-if="locations.length" v-for="(item, index) in locations" :key="index">
        <div class="background" v-html="renderWeatherContainer(getWeatherConditionDescription(item.info[0].condition.value))"></div>
        <Menu as="div" class="relative inline-block text-left" style="position: absolute; top: 1rem; right: 1rem; z-index: 1000; width: 20px; height: 20px; cursor: pointer;">
          <div>
            <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
              <span class="sr-only">Open options</span>
              <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
          </div>

          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <button @click="deleteLocation(item.location)" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm inline-flex justify-between w-full']"><p>Delete Location</p><svg version="1.1" id="trashcan.svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64; fill: #868686; width: 1rem;" xml:space="preserve">
        <path class="can st0" d="M32.1,18h22c1.4,0,1.8,0.5,1.7,1.9c-0.5,4.6-1,9.2-1.5,13.8c-0.5,4.5-0.9,8.9-1.4,13.4c-0.5,4.5-1,9.1-1.4,13.6c-0.1,0.6-0.1,1.2-0.2,1.7c0.1,0.7-0.4,1.4-1.2,1.5c-0.1,0-0.3,0-0.4,0c-6.1,0-12.1,0-18.2,0H14.6c-1.3,0-1.6-0.3-1.8-1.7c-0.5-4.5-1-9-1.4-13.5s-0.9-9-1.4-13.5C9.5,31.2,9,27.1,8.6,23c-0.1-1.1-0.2-2.2-0.3-3.3c-0.2-0.7,0.2-1.4,1-1.6c0.2,0,0.3-0.1,0.5,0c2.9,0,5.8,0,8.7,0L32.1,18L32.1,18L32.1,18z M18.5,41c0,4.5,0,8.9,0,13.4c0,0.3,0,0.6,0.1,0.8c0.2,0.9,1.1,1.5,2,1.4c1-0.2,1.7-1,1.6-2c0-1.5,0-3.1,0-4.6c0-7.4,0-14.8,0-22.3c0-0.5-0.1-1-0.4-1.4c-0.4-0.7-1.2-1-2-0.8c-0.8,0.3-1.4,1.1-1.3,1.9C18.5,32,18.5,36.5,18.5,41z M33.9,41c0-4.5,0-8.9,0-13.4c0.2-1-0.5-2-1.5-2.2c-1-0.2-2,0.5-2.2,1.5c0,0.2,0,0.4,0,0.6c0,8.9,0,17.8,0,26.7c-0.2,1,0.5,2,1.6,2.2c1,0.2,2-0.5,2.2-1.6c0-0.2,0-0.4,0-0.6C33.9,49.9,33.9,45.5,33.9,41L33.9,41z M45.4,41v-2.1c0-3.8,0-7.6,0-11.4c0.1-1-0.7-1.9-1.7-2s-1.9,0.7-2,1.7c0,0.1,0,0.2,0,0.3	c0,0.2,0,0.4,0,0.6c0,8.3,0,16.6,0,24.9c0,0.7,0,1.3,0,2c0.1,0.9,0.8,1.6,1.6,1.7c0.9,0.1,1.7-0.5,1.9-1.3c0.1-0.4,0.1-0.7,0.1-1.1	C45.4,49.7,45.4,45.4,45.4,41L45.4,41z"/>
        <path class="lid st0" d="M32,15c-8,0-16,0-24,0c-1.8,0.1-3.4-1.2-3.6-3.1c-0.3-1.8,1-3.6,2.8-3.9C7.6,8,8,8,8.4,8c4.2,0,8.4,0,12.7,0c0.6,0.1,1.1-0.3,1.2-0.9c1.7-5.4,7.4-8.4,12.8-6.7c3.2,1,5.7,3.5,6.7,6.6c0.1,0.6,0.7,1.1,1.3,1c4.2,0,8.4,0,12.6,0c0.5,0,0.9,0,1.4,0.1c1.8,0.4,2.9,2.2,2.6,4c-0.2,1.7-1.7,3-3.4,2.9c-6.4,0-12.8,0-19.2,0L32,15L32,15z M32,8c2,0,4,0,6.1,0c0.9,0,1.1-0.3,0.6-1.1c-1.2-2.5-3.8-4.1-6.6-4.1c-2.8,0-5.4,1.6-6.7,4.1c-0.4,0.7-0.2,1,0.6,1C28,8,30,8,32,8z"/>
        </svg></button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <div class="card__image"></div>
        <div class="card__location-name" v-if="item.location">{{ item.location }}</div>
        <div class="card__content">
          <div class="card__infos" v-for="info in item.info">
            <div class="card__date">{{ formatDate(info.temp.date) }}</div>
            <div class="card__temp">Temparatur: {{ info.temp.value }} °C</div>
            <div class="card__precip">Niederschlag: {{ info.precip.value }} ml</div>
            <div class="card__wind">Windgeschindigkeit: {{ info.wind.value }} m/s</div>
          </div>
        </div>
      </div>
      
      <div class="card card--new" @click="openModal">
        <svg width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"/>
            <path d="M25 15 L 25 35" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
            <path d="M15 25 L 35 25" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        </svg>
      </div>
      <Modal :isOpen="isModalOpen" @update:modelValue="isModalOpen = $event" @submit="handleInputSubmit" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getData } from '../assets/ts/api/meteomatics';
import Modal from '../components/modal/new-location.vue';
import axios from 'axios';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'


// Define reactive properties
const searchTerm = ref('');
const locations = ref([]);

let fetchedInfos;
let isFetching = false;

// Fetch the data when submitting a new location and save it to the database
const handleInputSubmit = (value) => {
  if (!isFetching) {
    isFetching = true;
    searchTerm.value = value.value;
    fetchData().then(data => {
      saveLocation(data.location.value);
      if (locations.value.some(obj => obj.location === data.location.value)) {
        alert('The location has already been added!');
        return;
      }
      locations.value.push(data);
      }).finally(() => {
        isFetching = false;
    });
  }
}

// Fetch the data for the location
const fetchData = async (locationName) => {
  if (locationName) {
    fetchedInfos = await getData(locationName);
  } else {
    fetchedInfos = await getData(searchTerm);
  }

  // location.value = fetchedInfos!.location.value;
  // info.value = fetchedInfos!.info.value;
  return fetchedInfos;
}

function formatDate(dateString: string) {
  // Parse input to date object
  const date = new Date(dateString);

  // xtract day, month and hour
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format date and time
  return `${day}.${month}.${date.getFullYear()} | ${hours}:${minutes}`;
}

// Parse data to python for database
async function saveLocation(name: string) {
  const response = await fetch('http://127.0.0.1:5000/save_locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `name=${name}`,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
}

async function getSavedLocations() {
  try {
    const response = await fetch ('http://127.0.0.1:5000/get_locations');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
      
    const data = await response.json();
    
    if (data.fetched == false) return;
    
    const fetchDataPromises = data.map(async (item: any) => {
      return await fetchData(item.name);
    })
      
    locations.value = await Promise.all(fetchDataPromises);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteLocation(locationName: string): Promise<void> {
  try {
    const response = await axios.delete(`http://127.0.0.1:5000/delete_location/${locationName}`);
    if (locations.value.some(obj => obj.location === locationName)) {
      // Remove the item from the array
      locations.value = locations.value.filter(obj => obj.location !== locationName);
    }
    
    console.info('Deleted location successfully');
  } catch (error) {
    console.error('Error deleting location:', error);
  }
}

onMounted(getSavedLocations);

// Define the mapping for daytime and nighttime condition
const weatherConditions = {
  '1': { 'daytime': 'clear-sky', 'nighttime': 'clear-sky' },
  '2': { 'daytime': 'light-clouds', 'nighttime': 'light-clouds' },
  '3': { 'daytime': 'partly-cloudy', 'nighttime': 'partly-cloudy' },
  '4': { 'daytime': 'cloudy', 'nighttime': 'cloudy' },
  '5': { 'daytime': 'rain', 'nighttime': 'rain' },
  '6': { 'daytime': 'sleet', 'nighttime': 'sleet' },
  '7': { 'daytime': 'snow', 'nighttime': 'snow' },
  '8': { 'daytime': 'rain-shower', 'nighttime': 'rain-shower' },
  '9': { 'daytime': 'snow-shower', 'nighttime': 'snow-shower' },
  '10': { 'daytime': 'sleet-shower', 'nighttime': 'sleet-shower' },
  '11': { 'daytime': 'light-fog', 'nighttime': 'light-fog' },
  '12': { 'daytime': 'dense-fog', 'nighttime': 'dense-fog' },
  '13': { 'daytime': 'freezing-rain', 'nighttime': 'freezing-rain' },
  '14': { 'daytime': 'thunderstorms', 'nighttime': 'thunderstorms' },
  '15': { 'daytime': 'drizzle', 'nighttime': 'drizzle' },
  '16': { 'daytime': 'sandstorm', 'nighttime': 'sandstorm' }
};

// Function to get the weather condition description based on the code
function getWeatherConditionDescription(code: number): string {
  // Determine if it's daytime or nighttime based on the code
  const isDaytime = parseInt(code) >= 1 && parseInt(code) <= 16;

  if (code > 17) {
    code = code - 100;
  }

  const condition = weatherConditions[code];

  if (!condition) {
    return 'Unknown condition';
  }
  return isDaytime? condition['daytime'] : condition['nighttime'];
}

function renderWeatherContainer(conditionDescription) {
  switch (conditionDescription) {
    case "clear-sky":
      return `
      <div class="weather-container clear-day">
        <div class="sun"></div>
        <div class="sun-ray r-one"></div>
        <div class="sun-ray r-two"></div>
        <div class="sun-ray r-three"></div>
        <div class="sun-ray r-four"></div>
        <div class="cloud">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
      </div>
      `;
    case "light-clouds":
      return `
        <div class="weather-container partly-cloudy">
          <div class="cloudleft">
            <div class="circle c-one"></div>
            <div class="circle c-two"></div>
          </div>
          <div class="cloudbottom">
            <div class="circle c-one"></div>
            <div class="circle c-two"></div>
            <div class="circle c-three"></div>
            <div class="circle c-four"></div>
          </div>
          <div class="cloudright">
            <div class="circle c-one"></div>
          </div>
        </div>
        `;
    case "partly-cloudy":
      return `
      <div class="weather-container partly-cloudy">
        <div class="cloudleft">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
        </div>
        <div class="cloudbottom">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
          <div class="circle c-four"></div>
        </div>
        <div class="cloudright">
          <div class="circle c-one"></div>
        </div>
      </div>
      `;
    case "cloudy":
      return `
      <div class="weather-container cloudy">
        <div class="cloud-one">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-two">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-three">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-four">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-five">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-six">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-seven">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-eight">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-nine">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-ten">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-eleven">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-twelve">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
      </div>`;
    case "rain":
      return `
      <div class="weather-container rain">
        <div class="cloud-one">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
          <div class="circle c-four"></div>
        </div>
        <div class="cloud-two">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="cloud-three">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
        </div>
        <div class="droplet-container"></div>
      </div>
      `;
    case "sleet":
      return '<div class="weather-container sleet">...</div>';
    case "snow":
      return `
      <div class="weather-container snow">
        <div class="cloud-one">
          <div class="circle c-one"></div>
          <div class="circle c-two"></div>
          <div class="circle c-three"></div>
        </div>
        <div class="snowflake-container"></div>
      </div>
      `;
    case "rain-shower":
      return '<div class="weather-container rain-shower">...</div>';
    case "snow-shower":
      return '<div class="weather-container snow-shower">...</div>';
    case "sleet-shower":
      return '<div class="weather-container sleet-shower">...</div>';
    case "light-fog":
      return '<div class="weather-container light-fog">...</div>';
    case "dense-fog":
      return '<div class="weather-container dense-fog">...</div>';
    case "freezing-rain":
      return '<div class="weather-container freezing-rain">...</div>';
    case "thunderstorms":
      return '<div class="weather-container thunderstorms">...</div>';
    case "drizzle":
      return '<div class="weather-container drizzle">...</div>';
    case "sandstorm":
      return '<div class="weather-container sandstorm">...</div>';
    default:
      return '';
  }
}


// Modal logic
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables/colors';

.main {
    
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
}

.section {

  padding: 2rem 0;


  &__cards {
    
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1rem;
    width: 100%;
    max-width: 80vw;

    overflow-x: auto;
  }
}

.card {
  position: relative;

  padding: .5rem 1rem;
  width: 17rem;
  min-width: 17rem;
  height: 20rem;

  color: $c-black;
  background-color: $c-secondary;
  border-radius: .5rem;
  overflow: hidden;

  transition: height .5s ease-in-out;
  
  &__location-name {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translateX(-50%);

    width: 80%;

    padding: .75rem;
    margin-bottom: 1rem;

    font-size: 1.25rem;
    text-align: center;

    transition: top .5s ease-in-out;
  }
  
  &__content {
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%) ;

    width: 80%;
    max-height: 13rem;

    overflow-y: scroll;

    transition: top .5s ease-in-out;
  }

  &__infos {
    &:not(:last-child) {
      padding-bottom: .5rem;
      margin-bottom: .5rem;

      border-bottom: .125rem solid $c-black;
    }
  }
  
  &:hover {
    background-color: $c-blue;

    .card__location-name {
      top: 2rem;
    }

    .card__content {
      top: 6rem;
    }

    .background {
      &::after {
        content: "";

        opacity: .5;
      }
    }
  }

  &--new {
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    cursor: pointer;
  }

  .background {
    position: absolute;
    inset: -1rem;

    &::after {
      content: "";
      position: absolute;
      inset: 0 0 0 0;

      background-color: $c-white;
      opacity: 0;

      transition: opacity .5s ease-in-out;
    }
  }
}
</style>