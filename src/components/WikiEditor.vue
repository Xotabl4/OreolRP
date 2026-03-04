<template>
  <div class="wiki-editor">
    <div v-if="editor" class="editor-toolbar">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" title="Жирный"><b>B</b></button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" title="Курсив"><i>I</i></button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" title="Зачеркнутый"><s>S</s></button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" title="Обычный текст">P</button>
        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" title="Заголовок 1">H1</button>
        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" title="Заголовок 2">H2</button>
        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" title="Заголовок 3">H3</button>
        
        <div class="divider"></div>
        <button class="editor-btn" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" title="Маркированный список">• Список</button>
        <button class="editor-btn" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" title="Нумерованный список">1. Список</button>
        <button class="editor-btn" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" title="Цитата">"" Цитата</button>

        <div class="divider"></div>
        <button class="editor-btn" @click="addImage" title="Вставить картинку (По URL)">🖼️ Картинка</button>
        <button class="editor-btn" @click="addVideo" title="Вставить видео с YouTube (По URL)">🎬 YouTube</button>
      
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
    </div>
    
    <editor-content :editor="editor" class="tiptap-editor" @click="focusEditor" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Mark, mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Кастомное расширение TipTap для цветов (копия из EditableText)
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
        const currentAttributes = editor.getAttributes('textColor');
        return commands.setMark('textColor', { color, glow: currentAttributes.glow || false });
      },
      unsetTextColor: () => ({ commands }) => {
        return commands.unsetMark('textColor');
      },
      toggleTextGlow: () => ({ commands, editor }) => {
        const currentAttributes = editor.getAttributes('textColor');
        if (currentAttributes.color) {
           return commands.setMark('textColor', { color: currentAttributes.color, glow: !currentAttributes.glow });
        }
        return false;
      }
    };
  },
});

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    TextColor,
    Image,
    Youtube.configure({
      inline: false, // Render as a block node
      nocookie: true, // Use youtube-nocookie.com
      modestBranding: true, // Hide YouTube logo
      controls: false, // Hide player controls
      autoplay: false, // Do not autoplay
      width: 640,
      height: 360,
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
});

const focusEditor = () => {
  if (editor.value && !editor.value.isFocused) {
    editor.value.commands.focus('end');
  }
};

const addImage = () => {
  const url = window.prompt('Введите URL картинки:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const addVideo = () => {
  const url = window.prompt('Введите URL YouTube видео:\n(например, https://www.youtube.com/watch?v=...)')
  if (url) {
    editor.value.commands.setYoutubeVideo({
      src: url,
    })
  }
}

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value;
  if (!isSame) {
    editor.value.commands.setContent(value, false);
  }
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
.wiki-editor {
  background: #1f2937;
  border: 1px solid #f97316;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 400px; /* Большое поле для редактирования Wiki */
}

/* Тулбар кнопок форматирования */
.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: #111827;
  border-bottom: 1px solid #374151;
  align-items: center;
  flex-wrap: wrap; /* Для мобильных */
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

/* Поле ввода TipTap */
.tiptap-editor {
  padding: 20px;
  color: inherit;
  font-size: 1em;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  cursor: text;
}

.tiptap-editor :deep(.ProseMirror) {
  flex-grow: 1;
  outline: none;
  min-height: 100%;
}

/* Кастомные цвета типографики */
.tiptap-editor :deep(.text-color-white) { color: #ffffff; }
.tiptap-editor :deep(.text-color-orange) { 
  background: linear-gradient(135deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: bold;
}
.tiptap-editor :deep(.text-color-green) { color: #22c55e; }
.tiptap-editor :deep(.text-color-red) { color: #ef4444; }
.tiptap-editor :deep(.text-color-purple) { color: #a855f7; }
.tiptap-editor :deep(.text-color-gray) { color: #9ca3af; }

/* Эффекты свечения (Glow) */
.tiptap-editor :deep(.glow-white) { text-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
.tiptap-editor :deep(.glow-orange) { text-shadow: 0 0 20px rgba(251, 146, 60, 0.7); }
.tiptap-editor :deep(.glow-green) { text-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
.tiptap-editor :deep(.glow-red) { text-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
.tiptap-editor :deep(.glow-purple) { text-shadow: 0 0 15px rgba(168, 85, 247, 0.6); }
.tiptap-editor :deep(.glow-gray) { text-shadow: 0 0 15px rgba(156, 163, 175, 0.6); }

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
/* Стили для изображений и видео в редакторе (чтобы не ломали верстку) */
.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  display: block;
}

.tiptap iframe {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

/* Стили для цитат (blockquote) внутри редактора */
.tiptap blockquote {
  background-color: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 0 4px 4px 0;
  color: #d1d5db;
  font-style: italic;
}
</style>
