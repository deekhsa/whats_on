<template>
  <div class="bg-primeval min-h-screen py-8 px-4">
    <div class="flex flex-col md:flex-row justify-around items-center py-6">
      <h1 class="text-5xl font-bold text-center text-secondary mb-6 capitalize">{{ category }}</h1>
        <UInputMenu
          v-model="store.city"
          placeholder="Select your city"
          :options="cities"
          :uiMenu="{
            background: 'bg-primeval',
            option: {
              base: 'text-secondary',
              active: 'bg-black text-secondary'
            }
          }"
          :ui="{
            placeholder: 'placeholder-secondary',
            color: {
              white: {
                outline: ' bg-primeval text-secondary ring-1 ring-inset border border-dashed border-secondary ring-none focus:outline-none focus:ring-1 focus:ring-secondary'
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
    <div v-if="isloading" class="text-gray-400 text-center mt-12">
      <p class="text-3xl">Loading...</p>
    </div>

    <div v-else-if="!isloading && data.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
      <div v-for="item in data" :key="item.id" class="bg-box-secondary border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <img :src="item.horizontal_cover_image" :alt="item.name" class="w-full h-48 object-contain">
        
        <div class="p-4 flex-1">
          <h2 class="text-lg font-semibold text-secondary">{{ item.name }}</h2>
          <p class="text-gray-400 text-sm mt-1">{{ item.venue_date_string }}</p>
          <p class="text-gray-400 text-sm mt-1">  {{ item.venue_name ? item.venue_name + ', ' + item.city : item.city }}</p>
        </div>
        <div class="p-4  flex justify-between items-center">
          <span  v-if="item.price_display_string"  class="text-secondary font-bold"> {{ item.price_display_string.includes("₹") ? item.price_display_string : `₹${item.price_display_string}` }}</span>

          <button class="bg-secondary hover:bg-yellow-600 text-black-400 text-sm font-semibold px-4 py-2 rounded-lg transition-all" @click="redirectUrl(item?.url)">
            Book
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-400 text-center mt-12">
      <p class="text-3xl">Oops! No {{ category }} events found in {{ store.city }} right now.</p>
      <p class="text-lg mt-2">Check other cities or explore other <span class="text-secondary underline cursor-pointer" @click ="redirectHome">categories</span></p>
    </div>

  </div>
</template>



<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLocation } from '@/stores/location';
import dayjs from 'dayjs';

const store = useLocation();
const route = useRoute();
const category = ref(route.params.id);
const isloading = ref(false);
const cities = ref(["Chennai", "Mumbai", "Delhi", "Pune", "Bengaluru", "Hyderabad", "Kolkata"]);
const data = ref([]);
const bookMyShowLink = {
  events:'music-shows',
  food:'food-and-drinks',
  travel:'travel-meetups',
  sports:'sports',
  theatre:'movies',
  workshops:'workshops'
}
const bookMyShowRegion = {
  bengaluru:'BANG',
  chennai:'CHEN',
  mumbai:'MUMBAI',
  delhi:'NCR',
  pune:'PUNE',
  hyderabad:'HYD',
  kolkata:'KOLK'
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

const fetchData = async () => {
  if (!store.city) {
    store.updateCity('chennai');
  }

  try {
    isloading.value = true
    const result = await $fetch(`https://api.insider.in/home/get-homepage-data?city=${store.city.toLowerCase()}&group=Holi%202022&device=web`);
    data.value = Object.values(result.list.masterList).filter(item => 
      (item.group_id?.name?.toLowerCase() === category.value) || 
      (item.category_id?.name?.toLowerCase() === category.value)
    );
    const result2 = await $fetch(`https://in.bookmyshow.com/api/explore/v1/discover/${bookMyShowLink[category.value]}-${store.city.toLowerCase()}?region=${bookMyShowRegion[store.city.toLowerCase()]}`,{
      headers:{
        'x-app-code': 'WEB',
        'x-bms-id': '1.921732213.1739946413089',
        'x-platform-code':'DESKTOP-WEB'
      }
    })
    const data2 = category.value === 'theatre'? result2.meta.ldSchema.itemListSchema.itemListElement : result2.meta.ldSchema.eventsSchema
    for(let i=0; i< data2.length; i++){
      let startDate= '';
      let endDate= '';
      let priceText = "";
      if(category.value !== 'theatre'){
        startDate = dayjs(data2[i].startDate).format('D MMM');
        endDate = dayjs(data2[i].endDate).format('D MMM');
        const price = result2.listings[0].cards.find(k => k.analytics.title === data2[i].name);
        if (price) {
            const priceComponent = price.text.find(textBlock =>
                textBlock.components.some(component => component.text.includes("₹"))
            );
            if (priceComponent) {
              priceText = priceComponent.components.find(component => component.text.includes("₹")).text;
          }
        }
      }
      data.value.push({
        horizontal_cover_image : category.value !== 'theatre'? data2[i].image[0] : data2[i].image,
        name: data2[i].name,
        venue_date_string: category.value !== 'theatre' ? `${startDate} - ${endDate}`: '',
        venue_name: category.value !== 'theatre' ? data2[i].location.address.streetAddress : '',
        city: category.value !== 'theatre' ? data2[i].location.address.addressCountry: store.city,
        price_display_string: priceText,
        url:data2[i].url
        })
    }
    shuffleArray(data.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }finally{
    isloading.value = false
  }
};

const redirectUrl = (url) => {
  if(url){
    window.open(url, "_blank"); 
  }else{
    window.open(`https://insider.in/${store.city.toLowerCase()}`, "_blank");
  }
};

const redirectHome = () =>{
  navigateTo({path:"/"})
}

onMounted(fetchData);

watch([() => store.city, category], fetchData);
</script>


