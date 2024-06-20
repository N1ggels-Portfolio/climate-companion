<template>
  <main class="main">  
    <section class="section section__cards">
      <div class="card card__location" v-if="locations.length" v-for="(item, index) in locations" :key="index">
        <div class="background" v-html="renderWeatherContainer(getWeatherConditionDescription(item.info[3].condition.value))"></div>
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
    transform: translateY(470%);

    padding: .75rem;
    margin-bottom: 1rem;

    font-size: 1.25rem;
    text-align: center;

    transition: transform .5s ease-in-out;
  }
  
  &__content {

    max-height: 13rem;

    overflow-y: scroll;

    transform: translateY(120%);
    transition: transform .5s ease-in-out;
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
      transform: translateY(0);
    }

    .card__content {
      transform: translateY(0);
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
  }
}
</style>