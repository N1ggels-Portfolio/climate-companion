<!-- components/CustomModal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <h2 class="text-center text-black">Neuer Ort</h2>
      <p class="text-black">z.B. Mittererstraße 5, 80336 München</p>
      <form @submit.prevent="handleSubmit">
        <input v-model="inputValue" type="text" placeholder="Straße, Stadt oder Ort" />
        <button type="submit">Send</button>
      </form>
      <button @click="closeModal">Close</button>
    </div>
    <div class="close" @click="closeModal"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputValue = ref('');

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  emit('submit', inputValue);
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* Add your modal styles here */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  position: relative;
  z-index: 50;

  padding: 20px;
  
  border-radius: 8px;
  background-color: white;
}

.close {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: pointer;
}
</style>
