<template>
  <section class="section how-to-start" id="how-to-start">
    <div class="container">
      <div v-reveal class="section-header">
        <EditableText 
          contentKey="how-to-title"
          defaultText="Как начать играть?"
          tag="h2"
          :isEditingGlobally="isEditingMode"
          class="section-title"
        />
        <div class="section-line"></div>
        <EditableText 
          contentKey="how-to-subtitle"
          defaultText="Три простых шага отделяют вас от мира Oreol RP."
          tag="p"
          :isEditingGlobally="isEditingMode"
          class="section-subtitle"
        />
      </div>

      <div class="steps-container">
        <div v-reveal class="step-card fade-up">
          <div class="step-number" style="font-family: 'Inter', 'Roboto', 'Montserrat', sans-serif; font-weight: 800; -webkit-text-stroke: 0; color: transparent; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; font-size: 4rem; line-height: 1;">01</div>
          <div class="step-content">
            <EditableText 
              contentKey="how-to-step1-title"
              defaultText="Установите GTA V"
              tag="h3"
              :isEditingGlobally="isEditingMode"
            />
            <EditableText 
              contentKey="how-to-step1-desc"
              defaultText="Вам понадобится лицензионная копия игры Grand Theft Auto V (Steam, Epic Games или Rockstar Launcher)."
              tag="p"
              :isEditingGlobally="isEditingMode"
            />
          </div>
        </div>

        <div v-reveal class="step-line"></div>

        <div v-reveal class="step-card fade-up delay-1">
          <div class="step-number" style="font-family: 'Inter', 'Roboto', 'Montserrat', sans-serif; font-weight: 800; -webkit-text-stroke: 0; color: transparent; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; font-size: 4rem; line-height: 1;">02</div>
          <div class="step-content">
            <EditableText 
              contentKey="how-to-step2-title"
              defaultText="Скачайте FiveM"
              tag="h3"
              :isEditingGlobally="isEditingMode"
            />
            <EditableText 
              contentKey="how-to-step2-desc"
              defaultText="Скачайте и установите мультиплеерный клиент FiveM с официального сайта."
              tag="p"
              :isEditingGlobally="isEditingMode"
            />
            <a 
              href="https://fivem.net/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary btn-small"
            >
              Скачать FiveM
            </a>
          </div>
        </div>

        <div v-reveal class="step-line"></div>

        <div v-reveal class="step-card fade-up delay-2">
          <div class="step-number" style="font-family: 'Inter', 'Roboto', 'Montserrat', sans-serif; font-weight: 800; -webkit-text-stroke: 0; color: transparent; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; font-size: 4rem; line-height: 1;">03</div>
          <div class="step-content">
            <EditableText 
              contentKey="how-to-step3-title"
              defaultText="Оставьте заявку"
              tag="h3"
              :isEditingGlobally="isEditingMode"
            />
            <EditableText 
              contentKey="how-to-step3-desc"
              defaultText="Отправьте заявку на вступление."
              tag="p"
              :isEditingGlobally="isEditingMode"
            />
            <a 
              href="https://discord.gg/RVehWXeTkx"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-small"
            >
              Отправить заявку
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'
import EditableText from './EditableText.vue'

const isEditingMode = inject('isEditingMode')
</script>


