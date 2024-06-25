<template>
  <main class="main">  
    <section class="section section__cards">
      <div class="card card__location" v-if="locations.length" v-for="(item, index) in locations" :key="index">
        <div class="background" v-html="renderWeatherContainer(getWeatherConditionDescription(item.info[0].condition.value))"></div>

        <CardMenu :location="item.location" @submit="deleteLocation(item.location)" />

        <div class="card__location-info" v-if="item.location">
          <div class="card__info--current">
            <div class="info__temp">
              {{ item.info[0].temp.value }}°C
            </div>
            <div class="info__condition">
              {{ formatCondition(item.info[0].condition.value) }}
            </div>
          </div>
          {{ item.location }}
        </div>
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
import { ref, nextTick } from 'vue';
import { getData } from '../assets/ts/api/meteomatics';
import Modal from '../components/modal/new-location.vue';
import CardMenu from '../components/card-menu.vue';
import axios from 'axios';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';


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

function renderWeatherContainer(conditionDescription: string) {
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

function formatCondition(condition: number): string {
  if (condition > 16) {
    condition = condition - 100;
  }
  switch (condition) {
    case 1:
      return 'Clear sky'
    case 2:
      return 'Light clouds'
    case 3:
      return 'Partly cloudy'
    case 4:
      return 'Cloudy'
    case 5:
      return 'Rain'
    case 6:
      return 'Sleet'
    case 7:
      return 'Snow'
    case 8:
      return 'Rain shower'
    case 9:
      return 'Snow shower'
    case 10:
      return 'Sleet shower'
    case 11:
      return 'Light fog'
    case 12:
      return 'Dense fog'
    case 13:
      return 'Freezing rain'
    case 14:
      return 'Thunderstorms'
    case 15:
      return 'Drizzle'
    case 16:
      return 'Sandstorm'
  
    default:
      break;
  }
}

// Mutation observer to check if cards have been added for animation
onMounted(() => {
  // Assuming your dynamically generated HTML is inserted into a container with id 'weather-container'
  const targetNode = document.querySelector('.section__cards');

  const config = { childList: true, subtree: false };

  const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if the expected elements are present
        const expectedElements = document.querySelectorAll('.card__location');
        if(expectedElements.length > 0) {
          // Call your function here
          if (targetNode.querySelector('.rain')) {
            initRain();
          }
          
          if (targetNode.querySelector('.snow')) {
            initSnow();
          }
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
});

const numberOfDroplets: number = 60;
const numberOfSnowflakes: number = 30;

interface DropletInput {
  left: number;
  delay: string;
  opacity: string;
}

interface SnowflakeInput extends DropletInput {
  size: number;
  snowFallDuration: number;
  snowDriftDuration: number;
}

function createDroplet(input: DropletInput): void {
  const dropletContainer = document.querySelector('.droplet-container')!;
  dropletContainer.insertAdjacentHTML('afterbegin', '<div class="droplet"></div>');
  const droplet = dropletContainer.firstChild as HTMLElement;
  droplet.style.left = `${input.left}%`;
  droplet.style.animationDelay = `${input.delay}s`;
  droplet.style.opacity = input.opacity;
}

function createSnowflake(input: SnowflakeInput): void {
  const snowflakeContainer = document.querySelector('.snowflake-container')!;
  snowflakeContainer.insertAdjacentHTML('afterbegin', '<div class="snowflake"></div>');
  const snowflake = snowflakeContainer.firstChild as HTMLElement;
  snowflake.style.left = `${input.left}%`;
  snowflake.style.width = `${input.size}px`;
  snowflake.style.height = `${input.size}px`;
  snowflake.style.animationDelay = `${input.delay}s`;
  snowflake.style.animationDuration = `${input.snowFallDuration}s, ${input.snowDriftDuration}s`;
  snowflake.style.opacity = input.opacity;
}

function initRain() {
  // Generate droplets
  for (let i = 0; i < numberOfDroplets; i++) {
    const left = parseInt(Math.random() * 100);
    const delay = (Math.random() * 3).toFixed(3);
    const opacity = (Math.random() * 0.5).toFixed(2);

    createDroplet({ left, delay, opacity });
  }
}

function initSnow() {
  // Generate snowflakes
  for (let i = 0; i < numberOfSnowflakes; i++) {
    const left = parseInt(Math.random() * 100);
    const size = Math.floor(Math.random() * 11 + 5);
    const delay = (Math.random() * 10).toFixed(3);
    const snowFallDuration = Math.floor(Math.random() * 5 + 10);
    const snowDriftDuration = Math.floor(Math.random() * 4 + 4);
    const opacity = (Math.random() * 0.7).toFixed(2);

    createSnowflake({ left, size, delay, snowFallDuration, snowDriftDuration, opacity });
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

  &__info--current {

    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;

    font-size: 1rem;
  }
  
  &__location-info {
    position: absolute;
    top: 70%;
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
    max-height: 11rem;

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

    .card__location-info {
      top: 2rem;
    }

    .card__content {
      top: 7rem;
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

.menu {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  
  width: 20px;
  height: 20px;
  
  cursor: pointer;
}
</style>