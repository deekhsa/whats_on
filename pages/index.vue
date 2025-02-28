<template>
  <div class="bg-primeval min-h-screen">
    <NavbarComponent />
    
    <div class="flex items-center justify-center w-full mb-6 md:mb-9">
      <p class="text-gray-300 text-justify md:text-center text-2xl w-11/12 md:w-2/3">
        Discover events near you—food, travel, theater, sports, and more. Browse curated categories or search for specific events, 
        all tailored to your city. Never miss out on exciting happenings around you!
      </p>
    </div>

    <div class="flex justify-center">
      <div class="w-10/12 md:w-1/2">
        <UTabs 
          :items="tabItems" 
          class="py-6"
          :ui="{
            list: {
              base: 'relative',
              background: 'bg-box-secondary',
              height: 'h-16',
              padding: 'px-2', 
              marker: { 
                wrapper: 'absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none',
                base: 'w-full h-full',
                background: 'bg-secondary',
                rounded: 'rounded-md'
              },
              tab: {
                base: 'relative inline-flex items-center justify-center flex-shrink-0 w-full',
                background: 'bg-box-secondary hover:bg-secondary/20',
                active: 'bg-secondary text-black text-lg font-semibold',
                inactive: 'text-white',
                height: 'h-12',
                padding: 'px-2', 
                rounded: 'rounded-md'
              }
            }
          }"
          v-model="tabIndex"
        >
          <template #default="{ item }">
            <p class="font-extrabold text-xl">{{ item.label }}</p>
          </template>
        </UTabs>
      </div>
    </div>

    <!-- <div v-if="tabIndex === 1" class="flex justify-center mt-4 w-full">
      <div class="w-11/12 md:w-2/3">
        <div id="searchBox">
          <div class="gcse-search"></div>
        </div>
      </div>
    </div> -->

    <div v-if="tabIndex === 1" class="flex justify-center mt-4 w-full">
  <div class="w-11/12 md:w-2/3">
    <div id="searchBox">
      <input 
        v-model="query" 
        type="text" 
        placeholder="Search events..." 
        class="w-full p-3 border border-gray-300 rounded-lg bg-box-secondary text-white"
      />
    </div>
    
    <div v-if="loading" class="text-gray-400 text-center mt-4">Loading...</div>

    <div v-else-if="data.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div 
        v-for="item in data" 
        :key="item.id" 
        class="bg-box-secondary border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col"
      >
        <img :src="item.pagemap?.cse_thumbnail?.[0]?.src || 'icon/default-image.png'" 
             :alt="item.title" 
             class="w-full h-48 object-contain">
        
        <div class="p-4 flex-1">
          <h2 class="text-lg font-semibold text-secondary">{{ item.title }}</h2>
          <p class="text-gray-400 text-sm mt-1">{{ item.snippet }}</p>
        </div>
        
        <div class="p-4 flex justify-between items-center">
          <button 
            class="bg-secondary hover:bg-yellow-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-all" 
            @click="redirectUrl(item.link)"
          >
            View
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400 text-center mt-12">
      <p class="text-3xl">Oops! No results found for "{{ query }}"</p>
      <p class="text-lg mt-2">Try a different search or explore other categories.</p>
    </div>
  </div>
</div>


    <div v-if="tabIndex === 0" class="flex flex-col items-center justify-center mt-4 md:mt-0 w-full px-4 md:px-0">
      <div class="grid w-full max-w-7xl grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="(item, index) in categories" 
          :key="index" 
          @click="redirect(item.route)" 
          class="w-full min-h-[220px] cursor-pointer rounded-xl shadow-md flex flex-col items-center justify-center py-4 px-4 transition-transform duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-500"
          :class="item.bgClass"
        >
          <img class="h-32 w-32" :src="item.icon" alt="" />
          <p class="text-xl font-extrabold my-2" :class="item.textColor">{{ item.route.toUpperCase() }}</p>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
const store = useLocation();
const query = ref('');
const data = ref([]);
const loading = ref(false);

const tabIndex = ref(0);
const tabItems = [
  { key: 'explore', label: 'Explore' },
  { key: 'search', label: 'Search' }
];

const categories = [
  { route: 'food', icon: 'icon/food.png', bgClass: 'bg-box-secondary', textColor:'text-white' },
  { route: 'travel', icon: 'icon/travel.png', bgClass: 'bg-secondary', textColor:'text-black' },
  { route: 'sports', icon: 'icon/adventure.png', bgClass: 'bg-box-secondary', textColor:'text-white' },
  { route: 'theatre', icon: 'icon/movie.png', bgClass: 'bg-secondary', textColor:'text-black' },
  { route: 'workshops', icon: 'icon/workshop.png', bgClass: 'bg-box-secondary', textColor:'text-white' },
  { route: 'events', icon: 'icon/concert.png', bgClass: 'bg-secondary', textColor:'text-black' },
];
const { getCurrentLocation, emitter } = useLocationFinder();


const redirect = async (data) => {
  await navigateTo({ path: `/Category/${data}` });
};

// const loadGoogleSearch = () => {
//   if (process.client) {
//     // Check if the search box is already rendered
//     if (document.querySelector('.gcse-search')) {
//       return; // Prevent reloading if already exists
//     }

//     // Create a new script only if not already present
//     if (!document.querySelector('script[src="https://cse.google.com/cse.js?cx=b34f049ad5c134404"]')) {
//       const script = document.createElement('script');
//       script.src = 'https://cse.google.com/cse.js?cx=b34f049ad5c134404';
//       script.async = true;
//       document.head.appendChild(script);
//     }

//     // Ensure Google Search Engine renders only once
//     setTimeout(() => {
//       if (window.google && window.google.search) {
//         window.google.search.cse.element.render({
//           div: "searchBox",
//           tag: "search",
//         });
//       }
//     }, 1000);
//   }
// };

const allowedCategories = ["food", "music", "travel", "sports", "workshops", "movies"];

const searchResult = async () => {
  if (!query.value.trim()) {
    data.value = [];
    return;
  }

  loading.value = true;

  try {
    if(!store.city)  store.updateCity('chennai');
    const modifiedQuery = `${query.value} (${allowedCategories.join(" OR ")}) events in ${store.city}`;

    const response = await $fetch(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: "AIzaSyBv8Mh65VuZvwGgANVZrOqsJEo_A8jT3-0",
        cx: "b34f049ad5c134404",
        q: modifiedQuery
      }
    });

    data.value = response.items?.filter((item) => {
      return allowedCategories.some(category =>
        item.title.toLowerCase().includes(category) ||
        item.snippet.toLowerCase().includes(category)
      );
    }) || [];

  } catch (error) {
    console.error("Search error:", error);
    data.value = [];
  } finally {
    loading.value = false;
  }
};

watch(query, (newQuery) => {
  if (newQuery.trim().length > 3) {
    searchResult();
  } else {
    data.value = [];
  }
});


watch(tabIndex, (newIndex) => {
  if (newIndex === 1) {
    searchResult();
  }
});

const redirectUrl = (url) => {
  window.open(url, "_blank");
};

onMounted(async () => {
  // loadGoogleSearch();
  if (process.client) { 
      let cachedCity = false;
      if(localStorage.getItem('user_city')){
         cachedCity = true
      } 
      await getCurrentLocation();
      emitter.on("success", async (coords) => {
        store.updateLatLng(coords.latitude,coords.longitude)
        if (coords.latitude && coords.longitude && !cachedCity && !store.city) {
          const result = await findLocationByLatLng(coords.latitude, coords.longitude);
          if (result) {
            store.updateCity(result);
            localStorage.setItem('user_city', result);
          }
        }
      });
  }
});
</script>

