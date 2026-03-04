<template>
  <section class="hero" id="home">
    <div class="hero-bg"></div>
    <div class="container hero-content">
      <EditableText 
        contentKey="hero-title"
        defaultText='Добро пожаловать на <br><span class="highlight glow">Oreol RP</span>'
        tag="h1"
        :isEditingGlobally="isEditingMode"
        class="hero-title"
        v-reveal
      />
      <EditableText 
        contentKey="hero-subtitle"
        defaultText='Твоя новая жизнь в мире GTA 5 начинается здесь. Создай свою историю, построй карьеру, найди друзей или сколоти криминальную империю.'
        tag="p"
        :isEditingGlobally="isEditingMode"
        class="hero-subtitle delay-1"
        v-reveal
      />
      <div v-reveal class="hero-buttons delay-2">
        <EditableText 
          contentKey="hero-btn-primary"
          defaultText='Начать играть'
          tag="a"
          href="#how-to-start"
          :isEditingGlobally="isEditingMode"
          class="btn btn-primary btn-large"
        />
        <EditableText 
          contentKey="hero-btn-secondary"
          defaultText='Узнать больше'
          tag="a"
          href="#about"
          :isEditingGlobally="isEditingMode"
          class="btn btn-secondary btn-large outline"
        />
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <a href="#about" class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span>Скролльте вниз</span>
    </a>
  </section>
</template>

<script setup>
import { inject } from 'vue'
import EditableText from './EditableText.vue'

const isEditingMode = inject('isEditingMode')
</script>
