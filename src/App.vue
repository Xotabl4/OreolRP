<template>
  <div class="app-layout">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

// Глобальное состояние режима редактирования
const isEditingMode = ref(false)

// Функция для переключения режима (будет вызываться из Navbar)
const toggleEditMode = (status) => {
  isEditingMode.value = status
}

// Провайдим состояние всем дочерним компонентам
provide('isEditingMode', isEditingMode)
provide('toggleEditMode', toggleEditMode)

</script>
