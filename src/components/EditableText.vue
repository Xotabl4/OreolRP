<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Mark, mergeAttributes } from '@tiptap/core';
import { listenToText, saveTextToDB } from '../firebase';

// Кастомное расширение TipTap для цветов
const TextColor = Mark.create({
  name: 'textColor',

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) return {};
          
          let className = `text-color-${attributes.color}`;
          if (attributes.glow) {
            className += ` glow-${attributes.color}`;
          }
          
          return {
            'data-color': attributes.color,
            'data-glow': attributes.glow ? 'true' : null,
            class: className
          };
        },
      },
      glow: {
        default: false,
        parseHTML: element => element.getAttribute('data-glow') === 'true',
        // renderHTML is handled in 'color' attribute for combined classes
      }
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-color]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTextColor: color => ({ commands, editor }) => {
        // preserve glow state if setting a new color
        const currentAttributes = editor.getAttributes(this.name);
        return commands.setMark(this.name, { color, glow: currentAttributes.glow || false });
      },
      unsetTextColor: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
      toggleTextGlow: () => ({ commands, editor }) => {
        const currentAttributes = editor.getAttributes(this.name);
        // Only allow glow if a color is active!
        if (currentAttributes.color) {
           return commands.setMark(this.name, { color: currentAttributes.color, glow: !currentAttributes.glow });
        }
        return false;
      }
    };
  },
});

const props = defineProps({
  contentKey: {
    type: String,
    required: true
  },
  defaultText: {
    type: String,
    required: true
  },
  // We'll pass the global editing state from the app
  isEditingGlobally: {
    type: Boolean,
    default: false
  },
  // Allows customizing the wrapper tag (h1, p, span, etc)
  tag: {
    type: String,
    default: 'div'
  },
  // If true, the wrapper will act as an inline-block element instead of a block element
  inline: {
    type: Boolean,
    default: false
  }
});

const content = ref(props.defaultText);
const originalContent = ref(''); // For discarding changes
const isHovered = ref(false);
const isEditingNow = ref(false);

const editor = useEditor({
  content: content.value,
  extensions: [
    StarterKit,
    TextColor,
  ],
  onUpdate: ({ editor }) => {
    // Keep internal state updated
    content.value = editor.getHTML();
  },
});

// Listen to Firebase Realtime Database
onMounted(() => {
  listenToText(props.contentKey, (newContent) => {
    if (newContent !== null) {
      content.value = newContent;
      // If the editor is active but the user ISN'T actively typing in it, update the editor's content too.
      if (editor.value && !editor.value.isFocused) {
        editor.value.commands.setContent(newContent);
      }
    }
  });
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

// Enter edit mode
const startEditing = () => {
  if (!props.isEditingGlobally) return;
  originalContent.value = content.value;
  isEditingNow.value = true;
  isHovered.value = false;
  if (editor.value) {
    editor.value.commands.setContent(content.value);
    // Focus next tick
    setTimeout(() => editor.value.commands.focus(), 10);
  }
};

// Discard changes
const discardChanges = () => {
  content.value = originalContent.value;
  if (editor.value) {
    editor.value.commands.setContent(originalContent.value);
  }
  isEditingNow.value = false;
};

// Save changes to Firebase
const saveChanges = async () => {
  await saveTextToDB(props.contentKey, content.value);
  isEditingNow.value = false;
};

</script>

<template>
  <div 
    class="editable-wrapper" 
    :class="{ 
      'editing-mode-active': isEditingGlobally, 
      'hovered': isHovered && !isEditingNow, 
      'currently-editing': isEditingNow,
      'is-inline': inline 
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- READ MODE -->
    <component 
      v-if="!isEditingNow" 
      :is="tag" 
      v-html="content"
      class="display-content"
    ></component>

    <!-- PENCIL ICON (HOVER) -->
    <button 
      v-if="isEditingGlobally && isHovered && !isEditingNow" 
      class="edit-btn glass-btn" 
      @click="startEditing"
      title="Редактировать текст"
    >
      ✏️
    </button>

    <!-- EDIT MODE (TIPTAP EDITOR) -->
    <div v-if="isEditingNow" class="editor-container">
      <div class="editor-toolbar">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" title="Жирный"><b>B</b></button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" title="Курсив"><i>I</i></button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" title="Зачеркнутый"><s>S</s></button>
        <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" title="Обычный текст">P</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" title="Заголовок 1">H1</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" title="Заголовок 2">H2</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" title="Заголовок 3">H3</button>
        
        <div class="color-picker-group">
          <button @click="editor.chain().focus().unsetTextColor().run()" class="color-btn none" title="Убрать цвет">✕</button>
          <button @click="editor.chain().focus().setTextColor('white').run()" class="color-btn white" :class="{ 'is-active': editor.isActive('textColor', { color: 'white' }) }" title="Белый"></button>
          <button @click="editor.chain().focus().setTextColor('orange').run()" class="color-btn orange" :class="{ 'is-active': editor.isActive('textColor', { color: 'orange' }) }" title="Оранжевый (Ореол)"></button>
          <button @click="editor.chain().focus().setTextColor('green').run()" class="color-btn green" :class="{ 'is-active': editor.isActive('textColor', { color: 'green' }) }" title="Зеленый"></button>
          <button @click="editor.chain().focus().setTextColor('red').run()" class="color-btn red" :class="{ 'is-active': editor.isActive('textColor', { color: 'red' }) }" title="Красный"></button>
          <button @click="editor.chain().focus().setTextColor('purple').run()" class="color-btn purple" :class="{ 'is-active': editor.isActive('textColor', { color: 'purple' }) }" title="Фиолетовый"></button>
          <button @click="editor.chain().focus().setTextColor('gray').run()" class="color-btn gray" :class="{ 'is-active': editor.isActive('textColor', { color: 'gray' }) }" title="Серый"></button>
          
          <div style="width: 1px; height: 16px; background: #374151; margin: 0 4px;"></div>
          
          <button 
             @click="editor.chain().focus().toggleTextGlow().run()" 
             class="glow-btn" 
             :class="{ 'is-active': editor.isActive('textColor') && editor.getAttributes('textColor').glow }"
             :disabled="!editor.isActive('textColor')"
             title="Включить свечение (только для цветного текста)"
          >
            ✨
          </button>
        </div>

        <div class="toolbar-spacer"></div>
        
        <button class="action-btn discard" @click="discardChanges" title="Отменить">↩️</button>
        <button class="action-btn save" @click="saveChanges" title="Сохранить">💾</button>
      </div>
      
      <editor-content :editor="editor" class="tiptap-editor" />
    </div>
  </div>
</template>

<style scoped>
.editable-wrapper {
  position: relative;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  border-radius: 6px;
}

/* Принудительное наследование размеров, чтобы предотвратить двойное увеличение шрифтов браузером (e.g. h1 внутри div'а) */
.editable-wrapper.is-inline {
  display: inline-block;
  vertical-align: middle;
}

.display-content {
  font-size: 1em !important;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0 !important;
  padding: 0 !important;
}

/* Убираем отступы у TipTap элементов, чтобы не ломать верстку */
.display-content :deep(p:first-child) { margin-top: 0 !important; }
.display-content :deep(p:last-child) { margin-bottom: 0 !important; }

/* Эффект наведения при включенном глобальном режиме редактирования */
.editable-wrapper.editing-mode-active.hovered {
  border: 2px solid rgba(249, 115, 22, 0.6); /* Оранжевая рамка */
  background: rgba(249, 115, 22, 0.05); /* Легкий фон */
  padding: 4px;
  margin: -6px; /* Компенсируем padding чтобы верстка не прыгала */
}

/* Кнопка карандаша */
.edit-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #111827;
  border: 1px solid #f97316;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  font-size: 14px;
}

.edit-btn:hover {
  background: #f97316;
  transform: scale(1.1);
}

/* Контейнер самого редактора */
.editor-container {
  background: #1f2937;
  border: 1px solid #f97316;
  border-radius: 8px;
  overflow: hidden;
  z-index: 101;
}

/* Тулбар кнопок форматирования */
.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: #111827;
  border-bottom: 1px solid #374151;
  align-items: center;
}

.editor-toolbar button {
  background: transparent;
  border: none;
  color: #9ca3af;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: #374151;
  color: white;
}

.editor-toolbar button.is-active {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.toolbar-spacer {
  flex-grow: 1;
}

.action-btn {
  font-size: 16px !important;
}

.action-btn.save:hover {
  background: rgba(34, 197, 94, 0.2) !important;
}

.action-btn.discard:hover {
  background: rgba(239, 68, 68, 0.2) !important;
}

/* Поле ввода TipTap */
.tiptap-editor {
  padding: 12px;
  min-height: 80px;
  color: inherit;
  outline: none;
  font-size: 1em;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.tiptap-editor :deep(p:first-child) { margin-top: 0 !important; }
.tiptap-editor :deep(p:last-child) { margin-bottom: 0 !important; }

/* Кастомные цвета типографики */
.tiptap-editor :deep(.text-color-white),
.display-content :deep(.text-color-white) { color: #ffffff; }

/* Оранжевый - как в логотипе Oreol RP с градиентом */
.tiptap-editor :deep(.text-color-orange),
.display-content :deep(.text-color-orange) { 
  background: linear-gradient(135deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: bold; /* Градиенты выглядят лучше на жирном шрифте */
}

.tiptap-editor :deep(.text-color-green),
.display-content :deep(.text-color-green) { color: #22c55e; }

.tiptap-editor :deep(.text-color-red),
.display-content :deep(.text-color-red) { color: #ef4444; }

.tiptap-editor :deep(.text-color-purple),
.display-content :deep(.text-color-purple) { color: #a855f7; }

.tiptap-editor :deep(.text-color-gray),
.display-content :deep(.text-color-gray) { color: #9ca3af; }

/* Эффекты свечения (Glow) */
.tiptap-editor :deep(.glow-white), .display-content :deep(.glow-white) { text-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
.tiptap-editor :deep(.glow-orange), .display-content :deep(.glow-orange) { text-shadow: 0 0 20px rgba(251, 146, 60, 0.7); }
.tiptap-editor :deep(.glow-green), .display-content :deep(.glow-green) { text-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
.tiptap-editor :deep(.glow-red), .display-content :deep(.glow-red) { text-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
.tiptap-editor :deep(.glow-purple), .display-content :deep(.glow-purple) { text-shadow: 0 0 15px rgba(168, 85, 247, 0.6); }
.tiptap-editor :deep(.glow-gray), .display-content :deep(.glow-gray) { text-shadow: 0 0 15px rgba(156, 163, 175, 0.6); }

/* Панель выбора цвета */
.color-picker-group {
  display: flex;
  gap: 2px;
  align-items: center;
  border-left: 1px solid #374151;
  border-right: 1px solid #374151;
  padding: 0 6px;
  margin: 0 4px;
}

.color-btn {
  width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  margin: 0 2px !important;
  border: 1px solid #374151 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 10px !important;
}

.color-btn.is-active {
  border: 2px solid white !important;
  transform: scale(1.1);
}

.color-btn.none { background: transparent; color: #9ca3af; }
.color-btn.none:hover { color: white; }
.color-btn.white { background: #ffffff; }
.color-btn.orange { background: linear-gradient(135deg, #fb923c, #f97316); }
.color-btn.green { background: #22c55e; }
.color-btn.red { background: #ef4444; }
.color-btn.purple { background: #a855f7; }
.color-btn.gray { background: #9ca3af; }

/* Кнопка свечения */
.glow-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s;
  padding: 0 4px !important;
}

.glow-btn:hover:not(:disabled) {
  opacity: 0.8;
  transform: scale(1.1);
}

.glow-btn.is-active {
  opacity: 1;
  text-shadow: 0 0 10px #fb923c;
  transform: scale(1.1);
}

.glow-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(1);
}

</style>

<style>
/* Глобальные стили для самого содержимого TipTap */
.tiptap p.is-editor-empty:first-child::before {
  color: #6b7280;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.tiptap {
  outline: none;
}
</style>
