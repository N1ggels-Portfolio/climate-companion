<template>
  <main class="main">  
    <section class="section section__cards">
      <div class="card card__location">
        <div class="card__image"></div>
        <div class="card__location-name" v-if="location">{{ location }}</div>
        <div class="card__content">
          <div class="card__infos" v-if="info" v-for="item in info">
            <div class="card__date">{{ formatDate(item.temp.date) }}</div>
            <div class="card__temp">Temparatur: {{ item.temp.value }} °C</div>
            <div class="card__precip">Niederschlag: {{ item.precip.value }} ml</div>
            <div class="card__wind">Windgeschindigkeit: {{ item.wind.value }} m/s</div>
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
const location = ref('');
const info = ref([]);
const searchTerm = ref('');

let fetchedInfos;
let isFetching = false;

const handleInputSubmit = (value) => {
  if (!isFetching) {
    isFetching = true;
    searchTerm.value = value.value;
    fetchData().finally(() => {
      isFetching = false;
    });
  }
}

const fetchData = async () => {
  fetchedInfos = await getData(searchTerm);
  location.value = fetchedInfos!.location.value;
  info.value = fetchedInfos!.info.value;
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
}

.section {
  &__cards {
    
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1rem;

    overflow-x: scroll;
  }
}

.card {

  padding: .5rem 1rem;
  width: 17rem;
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
}
</style>