<template>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationFrameId;
const particles = [];
const maxDistance = 150; // Увеличиваем радиус поиска, так как точек стало сильно меньше
const mouse = { x: null, y: null, radius: 180 }; // Зона взаимодействия с мышью

// Цветовая гамма (оранжевая под стиль сайта и белая)
const colors = ['#fb923c', '#f97316', '#ea580c', '#ffffff'];

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.width;
    this.vx = (Math.random() - 0.5) * 1.0; // Скорость по X
    this.vy = (Math.random() - 0.5) * 1.0; // Скорость по Y
    this.radius = Math.random() * 1.5 + 0.8; // Размер точек
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.hasConnections = false; // Флаг: есть ли у точки хотя бы одна связь
  }

  update() {
    // Взаимодействие с краями
    if (this.x < 0 || this.x > this.canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > this.canvas.height) this.vy = -this.vy;

    // Взаимодействие с мышью
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        // Легкое отталкивание от мыши
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = forceDirectionX * force * 2;
        const directionY = forceDirectionY * force * 2;
        
        this.x -= directionX;
        this.y -= directionY;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Эффект свечения для точек (возвращаем четкость)
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0; // Сбрасываем для линий
  }
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
  }
};

const handleMouseMove = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

const handleMouseOut = () => {
  mouse.x = null;
  mouse.y = null;
};

const initParticles = (canvas) => {
  particles.length = 0;
  // Рассчитываем количество частиц (очень мало, чтобы были только редкие созвездия)
  const area = canvas.width * canvas.height;
  const count = Math.min(Math.floor(area / 35000), 50); // Не больше 50 штук на весь экран 
  
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(canvas));
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Сначала сбрасываем статус соединений и обновляем позиции
  for (let i = 0; i < particles.length; i++) {
    particles[i].hasConnections = false;
    particles[i].update();
  }

  // Находим соединения, рисуем линии и помечаем точки, у которых есть связи
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        // У обеих точек есть связь, значит их можно будет нарисовать
        particles[i].hasConnections = true;
        particles[j].hasConnections = true;

        ctx.beginPath();
        // Возвращаем видимость линиям (макс 50% непрозрачности)
        const opacity = (1 - (distance / maxDistance)) * 0.5;
        ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`; // Оранжевый оттенок
        ctx.lineWidth = 1.5; // Чуть толще линию для четкости связи
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Рисуем ТОЛЬКО те точки, у которых есть хотя бы одна связь
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].hasConnections) {
      particles[i].draw(ctx);
    }
  }

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  resizeCanvas();
  initParticles(canvasRef.value);
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles(canvasRef.value); // Пересоздаем при ресайзе
  });
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseout', handleMouseOut);
  
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseout', handleMouseOut);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Размещаем позади всего контента */
  pointer-events: none; /* Чтобы не мешал кликать на кнопки сайта */
}
</style>
