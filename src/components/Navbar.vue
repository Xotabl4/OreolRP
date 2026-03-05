<template>
  <header :class="['navbar', { 'scrolled': isScrolled }]">
    <div class="container nav-content">
      <router-link to="/" class="logo" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit;">
        <img src="../assets/logo.webp" alt="Oreol RP Logo" style="height: 40px; width: auto;" />
        <span>Oreol <span class="highlight">RP</span></span>
      </router-link>
      <nav class="nav-links">
        <template v-if="$route.path.includes('/wiki')">
          <router-link to="/">Главная</router-link>
          <router-link to="/#about">О нас</router-link>
          <router-link to="/#features">Особенности</router-link>
          <router-link to="/#how-to-start">Как начать</router-link>
        </template>
        <template v-else>
          <router-link to="/wiki">Wiki</router-link>
          <router-link to="/#about">О нас</router-link>
          <router-link to="/#features">Особенности</router-link>
          <router-link to="/#how-to-start">Как начать</router-link>
        </template>
      </nav>
      <div class="nav-right" style="display: flex; align-items: center; gap: 15px;">
        <!-- Если пользователь не авторизован -->
        <button v-if="!user" @click="loginWithDiscord" class="btn btn-secondary auth-btn" style="display: flex; align-items: center; gap: 8px;">
          <img src="../assets/discord-v2-svgrepo-com.svg" alt="Discord" style="width: 20px; height: 20px;" />
          <span class="auth-text">Войти через Discord</span>
        </button>

        <!-- Если пользователь авторизован -->
        <div v-else class="user-profile-container" style="position: relative;" @click="isDropdownOpen = !isDropdownOpen" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
          <button class="btn btn-secondary profile-btn" :style="[isEditingMode ? { borderColor: '#f97316', color: '#f97316' } : {}, { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '8px' }]">
            <img :src="user.avatar" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%;" />
            <span class="auth-text">{{ user.username }}</span>
            <svg class="auth-text" style="width: 14px; height: 14px; margin-left: 4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Выпадающее меню -->
          <div v-if="isDropdownOpen" class="profile-dropdown" style="position: absolute; top: 100%; right: 0; padding-top: 8px; z-index: 100;">
            <div style="background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 8px; min-width: 180px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; gap: 4px;">
            <!-- Кнопка редактирования только для избранных ID -->
            <button v-if="isAdmin" @click.prevent="handleEditToggle" class="dropdown-item" style="display: flex; align-items: center; justify-content: flex-start; gap: 10px; padding: 10px 12px; color: var(--text-main); text-decoration: none; border-radius: 6px; transition: background 0.2s; font-size: 0.9rem; margin: 0; background: transparent; border: none; width: 100%; text-align: left; cursor: pointer;">
              ✏️ <span>{{ isEditingMode ? 'Выйти из режима' : 'Редактирование' }}</span>
            </button>
            <button @click="logout" class="dropdown-item" style="display: flex; align-items: center; justify-content: flex-start; gap: 10px; width: 100%; text-align: left; padding: 10px 12px; background: transparent; border: none; color: #ef4444; border-radius: 6px; cursor: pointer; transition: background 0.2s; font-size: 0.9rem; font-family: inherit; margin: 0;">
              🚪 <span>Выйти</span>
            </button>
            </div>
          </div>
        </div>

        <!-- Мобильная кнопка главного меню -->
        <button class="main-mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <svg v-if="!isMobileMenuOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Мобильное выпадающее меню -->
    <div class="mobile-nav-overlay" :class="{ 'open': isMobileMenuOpen }">
      <nav class="mobile-nav-links" @click="isMobileMenuOpen = false">
        <template v-if="$route.path.includes('/wiki')">
          <router-link to="/">Главная</router-link>
          <router-link to="/#about">О нас</router-link>
          <router-link to="/#features">Особенности</router-link>
          <router-link to="/#how-to-start">Как начать</router-link>
        </template>
        <template v-else>
          <router-link to="/wiki">Wiki</router-link>
          <router-link to="/#about">О нас</router-link>
          <router-link to="/#features">Особенности</router-link>
          <router-link to="/#how-to-start">Как начать</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute
import config from '../config.json'

const route = useRoute() // Initialize useRoute
const isScrolled = ref(false)
const user = ref(null)
const isDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Инжектим глобальное состояние редактирования
const isEditingMode = inject('isEditingMode')
const toggleEditMode = inject('toggleEditMode')

// Получаем список ID администраторов из файла конфигурации
const adminDiscordIds = config.adminDiscordIds || []

const isAdmin = computed(() => {
  return user.value && adminDiscordIds.includes(user.value.id)
})

const handleEditToggle = () => {
  toggleEditMode(!isEditingMode.value)
  isDropdownOpen.value = false // Закрываем меню после клика
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const loginWithDiscord = () => {
  const clientId = '888924869251719250'
  const redirectUri = encodeURIComponent('http://oreolrp.ru/')
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=identify`
  
  window.location.href = oauthUrl
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Проверяем, вернулись ли мы с Discord OAuth
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1)) // Убираем #
    const token = params.get('access_token')
    
    if (token) {
      // Сохраняем токен
      localStorage.setItem('discord_token', token)
      
      // Очищаем URL, чтобы не светить токен
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      
      // Идем за профилем пользователя
      fetchUserProfile(token)
    }
  } else {
    // Если страница просто загрузилась, проверяем, есть ли уже токен
    const savedToken = localStorage.getItem('discord_token')
    if (savedToken) {
      fetchUserProfile(savedToken)
    }
  }
})

const fetchUserProfile = async (token) => {
  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      user.value = {
        username: data.global_name || data.username,
        id: data.id,
        avatar: data.avatar 
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` 
          : 'https://cdn.discordapp.com/embed/avatars/0.png' // Дефолтная аватарка
      }
    } else {
      // Токен протух или неверный
      localStorage.removeItem('discord_token')
    }
  } catch (err) {
    console.error('Ошибка при получении профиля Discord:', err)
  }
}

const logout = () => {
  localStorage.removeItem('discord_token')
  user.value = null
  toggleEditMode(false) // При выходе выключаем режим редактирования
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.main-mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 4px;
}

.mobile-nav-overlay {
  display: none; /* скрыто на десктопе по умолчанию */
}

@media (max-width: 768px) {
  .main-mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Скрыть текст авторизации/имени на мобилках чтобы влезло */
  .auth-text {
    display: none !important;
  }
  
  .auth-btn, .profile-btn {
    padding: 8px !important;
  }

  .mobile-nav-overlay {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(18, 18, 18, 0.98);
    backdrop-filter: blur(15px);
    border-bottom: 1px solid var(--glass-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .mobile-nav-overlay.open {
    max-height: 300px;
  }
  
  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
  }
  
  .mobile-nav-links a {
    padding: 15px 20px;
    color: var(--text-main);
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    border-left: 3px solid transparent;
    transition: all 0.2s;
  }
  
  .mobile-nav-links a:hover {
    background: rgba(255, 255, 255, 0.05) !important;
    color: var(--accent-primary) !important;
    border-left-color: var(--accent-primary) !important;
  }
}
</style>
