<template>
  <Menu as="div" class="menu relative inline-block text-left">
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
            <form @submit.prevent>
              <button type="submit" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm inline-flex justify-between w-full']"><p>Delete Location</p>
                <svg version="1.1" id="trashcan.svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64; fill: #868686; width: 1rem;" xml:space="preserve">
                  <path class="can st0" d="M32.1,18h22c1.4,0,1.8,0.5,1.7,1.9c-0.5,4.6-1,9.2-1.5,13.8c-0.5,4.5-0.9,8.9-1.4,13.4c-0.5,4.5-1,9.1-1.4,13.6c-0.1,0.6-0.1,1.2-0.2,1.7c0.1,0.7-0.4,1.4-1.2,1.5c-0.1,0-0.3,0-0.4,0c-6.1,0-12.1,0-18.2,0H14.6c-1.3,0-1.6-0.3-1.8-1.7c-0.5-4.5-1-9-1.4-13.5s-0.9-9-1.4-13.5C9.5,31.2,9,27.1,8.6,23c-0.1-1.1-0.2-2.2-0.3-3.3c-0.2-0.7,0.2-1.4,1-1.6c0.2,0,0.3-0.1,0.5,0c2.9,0,5.8,0,8.7,0L32.1,18L32.1,18L32.1,18z M18.5,41c0,4.5,0,8.9,0,13.4c0,0.3,0,0.6,0.1,0.8c0.2,0.9,1.1,1.5,2,1.4c1-0.2,1.7-1,1.6-2c0-1.5,0-3.1,0-4.6c0-7.4,0-14.8,0-22.3c0-0.5-0.1-1-0.4-1.4c-0.4-0.7-1.2-1-2-0.8c-0.8,0.3-1.4,1.1-1.3,1.9C18.5,32,18.5,36.5,18.5,41z M33.9,41c0-4.5,0-8.9,0-13.4c0.2-1-0.5-2-1.5-2.2c-1-0.2-2,0.5-2.2,1.5c0,0.2,0,0.4,0,0.6c0,8.9,0,17.8,0,26.7c-0.2,1,0.5,2,1.6,2.2c1,0.2,2-0.5,2.2-1.6c0-0.2,0-0.4,0-0.6C33.9,49.9,33.9,45.5,33.9,41L33.9,41z M45.4,41v-2.1c0-3.8,0-7.6,0-11.4c0.1-1-0.7-1.9-1.7-2s-1.9,0.7-2,1.7c0,0.1,0,0.2,0,0.3	c0,0.2,0,0.4,0,0.6c0,8.3,0,16.6,0,24.9c0,0.7,0,1.3,0,2c0.1,0.9,0.8,1.6,1.6,1.7c0.9,0.1,1.7-0.5,1.9-1.3c0.1-0.4,0.1-0.7,0.1-1.1	C45.4,49.7,45.4,45.4,45.4,41L45.4,41z"/>
                  <path class="lid st0" d="M32,15c-8,0-16,0-24,0c-1.8,0.1-3.4-1.2-3.6-3.1c-0.3-1.8,1-3.6,2.8-3.9C7.6,8,8,8,8.4,8c4.2,0,8.4,0,12.7,0c0.6,0.1,1.1-0.3,1.2-0.9c1.7-5.4,7.4-8.4,12.8-6.7c3.2,1,5.7,3.5,6.7,6.6c0.1,0.6,0.7,1.1,1.3,1c4.2,0,8.4,0,12.6,0c0.5,0,0.9,0,1.4,0.1c1.8,0.4,2.9,2.2,2.6,4c-0.2,1.7-1.7,3-3.4,2.9c-6.4,0-12.8,0-19.2,0L32,15L32,15z M32,8c2,0,4,0,6.1,0c0.9,0,1.1-0.3,0.6-1.1c-1.2-2.5-3.8-4.1-6.6-4.1c-2.8,0-5.4,1.6-6.7,4.1c-0.4,0.7-0.2,1,0.6,1C28,8,30,8,32,8z"/>
                </svg>
              </button>
            </form>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  location: String
})
</script>