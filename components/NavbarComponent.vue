<template>
  <div class="flex flex-col md:flex-row justify-around items-center space-y-4">
    <img class="h-64 w-96 px-4 md:px-0" src="public/icon/logo-2.png" alt="Logo" />
    <UInputMenu
      v-model="store.city"
      placeholder="Select your city"
      :options="cities"
      :uiMenu="{
        background: 'bg-primeval',
        option: {
          base: 'text-secondary',
          active: 'bg-gray-900 text-secondary',
        },
      }"
      :ui="{
        placeholder: 'placeholder-secondary',
        color: {
          white: {
            outline: 'bg-primeval text-secondary ring-1 ring-inset border border-dashed border-secondary ring-none focus:outline-none focus:ring-1 focus:ring-secondary',
          }
        },
        size: {
          lg: 'px-4 py-3 text-lg', 
          xl: 'px-5 py-4 text-xl'  
        },
      }"
      size="lg" 
    />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLocation } from '@/stores/location'; 

const store = useLocation(); 
const cities = ref(["Chennai", "Mumbai", "Delhi", "Pune", "Bengaluru", "Hyderabad", "Kolkata"]);
</script>
