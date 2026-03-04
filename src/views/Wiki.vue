<template>
  <div class="wiki-layout">
    <div class="wiki-sidebar">
      <div class="sidebar-header">
        <h2>Wiki Oreol RP</h2>
        <button v-if="isAdmin && isEditingMode" class="btn btn-primary add-cat-btn" @click="createNewCategory">
          + Категория
        </button>
      </div>

      <div class="sidebar-categories" v-if="categories.length > 0">
        <div 
          class="category-wrapper" 
          v-for="cat in categories" 
          :key="cat.id"
        >
          <div class="category-title" @click="cat.expanded = !cat.expanded">
            <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1; word-break: break-word; padding-right: 8px;">
              <span class="chevron" :class="{'expanded': cat.expanded}" style="margin-top: 4px;">▼</span>
              <span style="line-height: 1.4;">{{ cat.title }}</span>
            </div>
            
            <div v-if="isAdmin && isEditingMode" class="category-actions" @click.stop>
              <button class="icon-btn edit-icon" @click="editCategory(cat)" title="Редактировать категорию">✏️</button>
              <button class="icon-btn delete-icon" @click="deleteCategory(cat)" title="Удалить категорию">🗑️</button>
            </div>
          </div>
          
          <div class="category-articles" v-show="cat.expanded">
            <router-link 
              v-for="article in cat.articles" 
              :key="article.id"
              :to="`/wiki/${cat.id}/${article.id}`"
              class="article-link"
              :class="{ 'active': activeArticleId === article.id || (route.params.article === article.id && !activeArticleId) }"
            >
              {{ article.title }}
            </router-link>
            
            <div v-if="isAdmin && isEditingMode" class="add-article-btn-wrapper" @click.stop>
              <button class="btn btn-secondary add-article-btn" @click="createNewArticle(cat.id)">
                + Статья
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="sidebar-empty">
        <p>Категорий пока нет</p>
      </div>
    </div>

    <div class="wiki-content" ref="contentRef" @scroll="handleScroll">
      <div v-if="isCreating" class="editor-interface">
        <div class="editor-header">
          <h2 v-if="editingArticleId">Редактирование статьи</h2>
          <h2 v-else>Создание новой статьи</h2>
          <div class="actions">
            <button class="btn btn-secondary" @click="cancelCreation">Отмена</button>
            <button class="btn btn-primary" @click="saveNewArticle" :disabled="!newArticle.title || !newArticle.categoryId">Сохранить</button>
          </div>
        </div>
        
        <div class="form-group">
          <label>Категория</label>
          <select v-model="newArticle.categoryId" class="custom-select">
            <option value="" disabled>Выберите категорию...</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Заголовок статьи</label>
          <input 
            v-model="newArticle.title" 
            type="text" 
            placeholder="Введите заголовок..."
            class="custom-input huge-input"
          />
        </div>
        
        <div class="form-group">
          <label>Содержимое</label>
          <WikiEditor v-model="newArticle.content" />
        </div>
      </div>

      <div v-else-if="categories.length > 0" class="articles-list">
        <div v-for="(cat, index) in categories" :key="cat.id" :id="`category-${cat.id}`" class="category-section">
          
          <div v-if="index > 0" class="category-divider"></div>
          <h2 class="category-section-title">{{ cat.title }}</h2>

          <div v-if="cat.articles && cat.articles.length > 0" class="category-articles-list">
            <div 
              v-for="article in cat.articles" 
              :key="article.id"
              :id="`article-${article.id}`"
              class="article-block"
            >
              <div class="article-block-header">
                <h1 class="article-title-display">{{ article.title }}</h1>
                <div class="article-actions" style="display: flex; gap: 10px;">
                  <button class="btn btn-secondary share-btn" @click="copyShareLink(article, cat)" title="Скопировать ссылку" style="padding: 6px 14px; font-size: 0.9rem; background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1);">
                    🔗 Поделиться
                  </button>
                  <button v-if="isAdmin && isEditingMode" class="btn btn-secondary" @click="editCurrentArticleDirect(article, cat)" style="padding: 6px 14px; font-size: 0.9rem;">
                    ✏️ Редактировать
                  </button>
                </div>
              </div>
              <div class="article-content" v-html="article.content"></div>
            </div>
          </div>
          <div v-else class="empty-cat-message">
            <p v-if="isAdmin && isEditingMode">В этой категории пока нет статей. Нажмите "+ Статья" в меню слева, чтобы добавить первую!</p>
            <p v-else>В этой категории пока нет статей.</p>
          </div>

        </div>
      </div>
      
      <div v-else class="empty-state">
        <p v-if="isAdmin && isEditingMode">Категорий пока нет. Нажмите "+ Категория" слева.</p>
        <p v-else>Категорий пока нет.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WikiEditor from '../components/WikiEditor.vue'
import { db } from '../firebase'
import { ref as dbRef, onValue, set } from "firebase/database"

const route = useRoute()
const router = useRouter()
const isEditingMode = inject('isEditingMode')
// Пока заглушка для прав админа
const isAdmin = ref(true) 

const isCreating = ref(false)
const currentArticle = ref(null)
const editingArticleId = ref(null)

const contentRef = ref(null)
const activeArticleId = ref(null)
const isUpdatingScroll = ref(false)
const isScrollSpying = ref(false)

// Форма новой/редактируемой статьи
const newArticle = ref({
  categoryId: '',
  title: '',
  content: ''
})

// Пустой список категорий, так как мы удалили моки
const categories = ref([])

// Плавная прокрутка к категории или статье при изменении маршрута
watch(() => route.params, (params) => {
  if (!isCreating.value) {
    // Если роут изменился из-за ручного скроллинга мышкой,
    // мы НЕ должны плавно прокручивать страницу в DOM
    if (isScrollSpying.value) {
       return;
    }

    nextTick(() => {
      let elId = null;
      if (params.article) {
        elId = `article-${params.article}`;
        if (!isUpdatingScroll.value) activeArticleId.value = params.article;
      } else if (params.category) {
        elId = `category-${params.category}`;
      }
      
      if (elId && !isUpdatingScroll.value) {
        const el = document.getElementById(elId);
        if (el) {
          isUpdatingScroll.value = true;
          // Плавно скроллим к нужной статье в списке, если она не слишком далеко
          const targetTop = el.offsetTop - 40;
          const distance = Math.abs(contentRef.value.scrollTop - targetTop);
          const isFar = distance > 1000;
          
          contentRef.value.scrollTo({
             top: targetTop,
             behavior: isFar ? 'auto' : 'smooth'
          });
          
          setTimeout(() => { isUpdatingScroll.value = false; }, isFar ? 100 : 800);
        } else {
           isUpdatingScroll.value = false;
        }
      } else {
         isUpdatingScroll.value = false;
      }
    });
  }
}, { immediate: true });


const handleScroll = () => {
  if (!contentRef.value || isCreating.value) return;
  const el = contentRef.value;
  
  if (el.scrollHeight <= el.clientHeight) return;

  // --- Ручной ScrollSpy (определяет какая статья в фокусе) ---
  if (!isUpdatingScroll.value) {
    const blocks = Array.from(document.querySelectorAll('.article-block'));
    if (blocks.length === 0) return;
    
    const containerRect = el.getBoundingClientRect();
    // Сместим фокус внимания значительно выше к верхней части экрана (20%)
    // Это решит проблему "показывает на 2 статью, когда 1 на самом верху"
    const viewCenter = containerRect.top + (el.clientHeight * 0.2); 
    
    let activeBlock = blocks[0];
    
    // Если мы на самом верху
    if (el.scrollTop <= 50) {
       activeBlock = blocks[0];
    }
    // Если мы долистали до самого-самого низа страницы
    else if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 10) {
       activeBlock = blocks[blocks.length - 1];
    } else {
       // Ищем блок, который пересекает центр, или тот, что ближе всего к нему
       let minDistance = Infinity;
       blocks.forEach(b => {
         const rect = b.getBoundingClientRect();
         // Если блок длинный и проходит сквозь центр - это то что надо
         if (rect.top <= viewCenter && rect.bottom >= viewCenter) {
            activeBlock = b;
            minDistance = -1; // Приоритет
         } else if (minDistance !== -1) {
            // Иначе ищем ближайший по верхней границе к центру
            const dist = Math.abs(rect.top - viewCenter);
            if (dist < minDistance) {
               minDistance = dist;
               activeBlock = b;
            }
         }
       });
    }

    const id = activeBlock.id.replace('article-', '');
    if (activeArticleId.value !== id) {
      activeArticleId.value = id;
      // Найдем к какой категории относится эта статья, чтобы обновить URL
      const catWithArticle = categories.value.find(c => c.articles && c.articles.some(a => a.id === id));
      if (catWithArticle) {
        // Устанавливаем флажок, чтобы роутер не перекидывал нас обратно при ручном скроллинге
        isScrollSpying.value = true;
        router.replace(`/wiki/${catWithArticle.id}/${id}`).finally(() => {
           // Сбрасываем флажок чуть позже, чтобы watch успел его прочитать
           setTimeout(() => { isScrollSpying.value = false; }, 100);
        });
      }
    }
  }
};

// Функция для сохранения всего дерева Wiki в Firebase
const saveWikiToDB = async () => {
  try {
    const wikiDataRef = dbRef(db, 'wiki/categories');
    // Очищаем от Vue Proxy через JSON.parse(JSON.stringify)
    const cleanData = JSON.parse(JSON.stringify(categories.value));
    await set(wikiDataRef, cleanData);
  } catch (err) {
    console.error("Ошибка сохранения в Firebase:", err);
  }
};

onMounted(() => {
  // Подписываемся на изменения в реальном времени из Firebase
  const wikiDataRef = dbRef(db, 'wiki/categories');
  onValue(wikiDataRef, (snapshot) => {
    const data = snapshot.val() || [];
    // Сохраняем локальное состояние раскрытости категорий, чтобы UI не дергался при синхронизации
    categories.value = data.map(dbCat => {
      const localCat = categories.value.find(c => c.id === dbCat.id);
      if (localCat) {
        dbCat.expanded = localCat.expanded;
      }
      return dbCat;
    });
  });
});

onUnmounted(() => {
  // Чистить обзервер больше не нужно
});

const copyShareLink = (article, cat) => {
  const url = `${window.location.origin}/wiki/${cat.id}/${article.id}`;
  navigator.clipboard.writeText(url).then(() => {
    alert('Ссылка на статью скопирована в буфер обмена!');
  }).catch(err => {
    console.error('Не удалось скопировать ссылку: ', err);
    // Фолбек для старых браузеров
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Ссылка на статью скопирована в буфер обмена!');
    } catch (err) {
      console.error('Не удалось скопировать ссылку: ', err);
    }
    document.body.removeChild(textArea);
  });
};

const createNewCategory = () => {
  try {
    const title = window.prompt('Введите название новой категории:');
    if (!title || !title.trim()) return;
    
    const newCat = {
      id: 'cat_' + Date.now().toString(),
      title: title.trim(),
      expanded: true,
      articles: []
    };
    
    categories.value.push(newCat);
    
    if (categories.value.length === 1) {
      if (isCreating.value) {
        newArticle.value.categoryId = newCat.id;
      }
      router.push(`/wiki/${newCat.id}`);
    } else {
      router.push(`/wiki/${newCat.id}`);
    }
    
    // Синхронизация с БД
    saveWikiToDB();
  } catch (err) {
    alert("Ошибка при создании категории: " + err);
  }
};

const editCategory = (cat) => {
  const newTitle = prompt('Введите новое название категории:', cat.title)
  if (newTitle && newTitle.trim() && newTitle.trim() !== cat.title) {
    cat.title = newTitle.trim()
    saveWikiToDB()
  }
}

const deleteCategory = (cat) => {
  const confirm1 = confirm(`Вы уверены, что хотите удалить категорию "${cat.title}"? Все вложенные статьи будут удалены!`)
  if (confirm1) {
    const confirm2 = confirm(`Точно уверены? Это действие ПОЛНОСТЬЮ удалит категорию "${cat.title}" и отменить его будет невозможно.`)
    if (confirm2) {
      categories.value = categories.value.filter(c => c.id !== cat.id)
      
      // Если мы сейчас просматривали или создавали статью в этой категории
      if (currentArticle.value && currentArticle.value.categoryId === cat.id) {
        currentArticle.value = null
        router.push('/wiki')
      } else if (isCreating.value && newArticle.value.categoryId === cat.id) {
        newArticle.value.categoryId = ''
      }
      
      saveWikiToDB()
    }
  }
}

const createNewArticle = (catId) => {
  editingArticleId.value = null;
  // Сбрасываем текущую статью и роут, чтобы показать интерфейс создания
  if (route.path !== '/wiki') {
    router.push('/wiki').then(() => {
      isCreating.value = true
      currentArticle.value = null
      newArticle.value = {
        categoryId: catId || (categories.value.length > 0 ? categories.value[0].id : ''),
        title: '',
        content: ''
      }
    })
  } else {
    isCreating.value = true
    currentArticle.value = null
    newArticle.value = {
      categoryId: catId || (categories.value.length > 0 ? categories.value[0].id : ''),
      title: '',
      content: ''
    }
  }
}


const editCurrentArticleDirect = (article, cat) => {
  editingArticleId.value = article.id;
  newArticle.value = {
    categoryId: cat.id,
    title: article.title,
    content: article.content
  };
  isCreating.value = true;
}


const cancelCreation = () => {
  isCreating.value = false;
  editingArticleId.value = null;
  newArticle.value = { categoryId: '', title: '', content: '' };
}

const saveNewArticle = () => {
  if (!newArticle.value.title || !newArticle.value.categoryId) {
    alert('Заполните заголовок и выберите категорию')
    return
  }
  
  // Времено сохраняем локально, потом заменим на вызов Firebase
  const cat = categories.value.find(c => c.id === newArticle.value.categoryId)
  if (cat) {
    let savedArticle;
    
    if (editingArticleId.value) {
      // Ищем старую категорию, если она изменилась
      const oldCat = categories.value.find(c => c.articles && c.articles.some(a => a.id === editingArticleId.value));
      if (oldCat && oldCat.id !== newArticle.value.categoryId) {
         oldCat.articles = oldCat.articles.filter(a => a.id !== editingArticleId.value);
         savedArticle = {
           id: editingArticleId.value,
           categoryId: newArticle.value.categoryId,
           title: newArticle.value.title,
           content: newArticle.value.content
         };
         cat.articles = cat.articles || [];
         cat.articles.push(savedArticle);
      } else {
         savedArticle = cat.articles.find(a => a.id === editingArticleId.value);
         if (savedArticle) {
           savedArticle.title = newArticle.value.title;
           savedArticle.content = newArticle.value.content;
         }
      }
    } else {
      savedArticle = {
        id: 'art_' + Date.now(),
        categoryId: newArticle.value.categoryId,
        title: newArticle.value.title,
        content: newArticle.value.content
      }
      cat.articles = cat.articles || []
      cat.articles.push(savedArticle)
    }
    
    cat.expanded = true
    
    // Выходим из режима создания
    isCreating.value = false
    editingArticleId.value = null
    currentArticle.value = savedArticle
    
    saveWikiToDB()
    
    // Меняем роут
    router.push(`/wiki/${cat.id}/${savedArticle.id}`)
  }
}

</script>

<style scoped>
.wiki-layout {
  display: flex;
  width: 100%;
  margin-top: 80px; /* Отступ сверху под шапку и центрирование */
  height: calc(100vh - 80px); /* Строго на оставшийся экран, чтобы убить второй скролл */
  overflow: hidden;
}

.wiki-sidebar {
  /* Базовый отступ для телефонов и узких экранов */
  padding-left: 20px;
  width: 300px;
  box-sizing: border-box;
  flex-shrink: 0;
  background: rgba(18, 18, 18, 0.9);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  
  /* Скрываем скроллбар */
  scrollbar-width: none; /* Для Firefox */
  -ms-overflow-style: none; /* Для IE/Edge */
}

/* Для Chrome, Safari и Opera скрываем скроллбар в меню */
.wiki-sidebar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1200px) {
  .wiki-sidebar {
    /* Ровно по линии контейнера */
    padding-left: calc(50vw - 588px);
    width: calc(280px + 50vw - 588px);
  }
}

.sidebar-header {
  padding: 0 20px 20px 0; /* Убрали левый отступ, чтобы прижать текст к сетке */
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-cat-btn {
  padding: 8px;
  font-size: 0.9rem;
}

.sidebar-categories {
  padding: 10px 0;
}

.category-title {
  padding: 12px 20px 12px 0; /* Убрали левый отступ */
  cursor: pointer;
  font-weight: 600;
  font-size: 1.2rem; /* Увеличили на четверть (~25% от стандартного для большей заметности) */
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--accent-primary);
  background: rgba(255, 255, 255, 0.02);
  user-select: none;
}

.category-title:hover {
  background: rgba(255, 255, 255, 0.05);
}

.category-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0; /* Не даем кнопкам сплющиться */
}

.category-title:hover .category-actions {
  opacity: 1;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.edit-icon:hover { color: #3b82f6; } /* Синий при наведении */
.delete-icon:hover { color: var(--danger-color, #ef4444); } /* Красный при наведении */

.chevron {
  font-size: 0.8rem;
  transition: transform 0.2s;
  transform: rotate(-90deg);
}

.chevron.expanded {
  transform: rotate(0deg);
}

.category-articles {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}

.article-link {
  padding: 10px 20px 10px 30px; /* Отступ текста от левого края (фон остается растянутым) */
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: var(--transition-fast);
  border-left: 3px solid transparent;
  width: 100%;
  box-sizing: border-box;
  display: block;
  position: relative;
}

/* Добавляем точку перед названием статьи для визуальной иерархии */
.article-link::before {
  content: "•";
  position: absolute;
  left: 15px; /* Позиция точки между границей и текстом */
  color: var(--text-muted);
  font-size: 1.2rem;
  line-height: 1;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s;
}


.article-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.article-link:hover::before {
  color: var(--primary-color);
}

.article-link.router-link-active,
.article-link.is-active {
  background: rgba(249, 115, 22, 0.1);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 600;
}

.article-link.router-link-active::before,
.article-link.is-active::before {
  color: var(--primary-color);
}

.add-article-btn-wrapper {
  padding: 10px 20px 0 40px;
}

.add-article-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.sidebar-empty {
  padding: 20px;
  color: var(--text-muted);
  text-align: center;
}

.wiki-content {
  flex: 1; /* Забирает всё остальное ширина до правого края экрана */
  padding-right: 20px;
  padding-left: 60px;
  padding-top: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  background: var(--bg-color);
  
  /* Скрываем скроллбар полностью */
  scrollbar-width: none; /* Для Firefox */
  -ms-overflow-style: none; /* Для IE/Edge */
}

@media (min-width: 1200px) {
  .wiki-content {
    /* Справа также ограничиваем зону ровно по правому краю предполагаемого контейнера 1200px */
    padding-right: calc(50vw - 588px);
  }
}

/* Для Chrome, Safari и Opera скрываем скроллбар */
.wiki-content::-webkit-scrollbar {
  display: none;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 60px; /* Отступ между категориями */
  width: 100%;
  padding-top: 40px; /* Пустота сверху */
  padding-bottom: 300px; /* Пустота снизу, чтобы последняя статья могла доехать до верха экрана */
}

.category-section {
  display: flex;
  flex-direction: column;
  position: relative;
  /* Убрали padding, так как теперь единая лента */
}

.category-divider {
  height: 2px;
  background: var(--accent-primary);
  margin: 60px 0 40px 0;
  opacity: 0.8;
  border-radius: 2px;
}

.category-articles-list {
  display: flex;
  flex-direction: column;
  gap: 40px; /* Отступ между статьями в одной категории */
}


.article-block {
  background: rgba(20, 20, 20, 0.4);
  border: 1px solid rgba(249, 115, 22, 0.4); /* Оранжевая окантовка */
  border-radius: 12px;
  padding: 40px;
}

.article-block-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 16px;
  margin-bottom: 30px;
}

.article-title-display {
  font-size: 1.6rem;
  color: var(--text-main);
  border: none;
  margin: 0;
  padding: 0;
}

.category-section-title {
  font-size: 1.9rem; /* Увеличили на ~25% (было 1.5) */
  color: var(--accent-primary);
  text-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.empty-cat-message {
  background: rgba(20, 20, 20, 0.2);
  border: 1px dashed var(--glass-border);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  color: var(--text-muted);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--text-muted);
  line-height: 1.6;
}

.editor-interface {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 16px;
}

.editor-header h2 {
  font-size: 1.8rem;
  color: var(--text-main);
}

.actions {
  display: flex;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.custom-input, .custom-select {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.custom-select {
  appearance: none;
  cursor: pointer;
}

.custom-select option {
  background: #1f2937;
  color: white;
}

.custom-input:focus, .custom-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

.huge-input {
  font-size: 1.5rem;
  font-weight: 600;
  padding: 16px 20px;
}


.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Стили для отрендеренного контента */
.article-content {
  color: var(--text-color);
  line-height: 1.6;
}

/* Стили цитат в готовых статьях */
:deep(.article-content blockquote) {
  background-color: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 0 4px 4px 0;
  color: #d1d5db; 
  font-style: italic;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: var(--accent-primary);
}

.article-content :deep(p) {
  margin-bottom: 1em;
}

.article-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Медиа (картинки и youtube) */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  display: block;
}

.article-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  border: none;
}

/* Кастомные цвета типографики для отрендеренного текста */
.article-content :deep(.text-color-white) { color: #ffffff; }
.article-content :deep(.text-color-orange) { 
  background: linear-gradient(135deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: bold;
}
.article-content :deep(.text-color-green) { color: #22c55e; }
.article-content :deep(.text-color-red) { color: #ef4444; }
.article-content :deep(.text-color-purple) { color: #a855f7; }
.article-content :deep(.text-color-gray) { color: #9ca3af; }

/* Эффекты свечения (Glow) для отрендеренного текста */
.article-content :deep(.glow-white) { text-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
.article-content :deep(.glow-orange) { text-shadow: 0 0 20px rgba(251, 146, 60, 0.7); }
.article-content :deep(.glow-green) { text-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
.article-content :deep(.glow-red) { text-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
.article-content :deep(.glow-purple) { text-shadow: 0 0 15px rgba(168, 85, 247, 0.6); }
.article-content :deep(.glow-gray) { text-shadow: 0 0 15px rgba(156, 163, 175, 0.6); }

</style>
