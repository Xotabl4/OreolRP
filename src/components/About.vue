<template>
  <section class="section about" id="about">
    <div class="container">
      <div v-reveal class="section-header">
        <EditableText 
          contentKey="about-title"
          defaultText="Что такое Oreol RP?"
          tag="h2"
          :isEditingGlobally="isEditingMode"
          class="section-title"
        />
        <div class="section-line"></div>
      </div>
      <div class="about-grid">
        <div v-reveal class="about-text fade-left">
          <EditableText 
            contentKey="about-subtitle"
            defaultText="Новый уровень RolePlay"
            tag="h3"
            :isEditingGlobally="isEditingMode"
          />
          <EditableText 
            contentKey="about-p1"
            defaultText="Oreol RP — это не просто сервер, это целая виртуальная вселенная, где ваши решения имеют вес. У нас проработанная экономика, уникальные системы фракций и работ, а также отзывчивая администрация."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
          <EditableText 
            contentKey="about-p2"
            defaultText="Мы создали мир, в котором комфортно как новичкам, так и опытным игрокам. Присоединяйтесь к другим игрокам и напишите свою уникальную историю."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
          <ul class="about-list">
            <li>
              <span>✓</span> 
              <EditableText 
                contentKey="about-li-1"
                defaultText="Стабильный сервер"
                tag="span"
                :isEditingGlobally="isEditingMode"
                inline
              />
            </li>
            <li>
              <span>✓</span> 
              <EditableText 
                contentKey="about-li-2"
                defaultText="Регулярные обновления"
                tag="span"
                :isEditingGlobally="isEditingMode"
                inline
              />
            </li>
            <li>
              <span>✓</span> 
              <EditableText 
                contentKey="about-li-3"
                defaultText="Уникальные механики созданные нашей командой"
                tag="span"
                :isEditingGlobally="isEditingMode"
                inline
              />
            </li>
          </ul>
        </div>
        <!-- Image Slider -->
        <div v-reveal class="about-image glass fade-right">
          <div v-if="images.length > 0" class="img-slider">
            <transition name="fade" mode="out-in">
              <img :key="currentImageIndex" :src="images[currentImageIndex]" alt="Атмосфера Лос-Сантоса" class="slider-image" />
            </transition>
          </div>
          <div v-else class="img-placeholder">
            <span>Атмосфера Лос-Сантоса</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import EditableText from './EditableText.vue';

const isEditingMode = inject('isEditingMode');

// Dynamically import all .webp images from the assets/images folder using Vite
const imageModules = import.meta.glob('../assets/images/*.webp', { eager: true });

// Extract the URL paths from the imported modules
const images = Object.values(imageModules).map((module) => module.default);

const currentImageIndex = ref(0);
let intervalId = null;

onMounted(() => {
  if (images.length > 1) {
    intervalId = setInterval(() => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
    }, 15000); // Change image every 15 seconds
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.img-slider {
  width: 100%;
  aspect-ratio: 16 / 9; /* Задаем жесткий формат 16:9 */
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Заполняем 16:9 без черных полос */
  display: block;
}

/* Vue transition classes for soft fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
