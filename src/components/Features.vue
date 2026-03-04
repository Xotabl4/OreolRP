<template>
  <section class="section features" id="features">
    <div class="container">
      <div v-reveal class="section-header">
        <EditableText 
          contentKey="features-title"
          defaultText="Особенности Сервера"
          tag="h2"
          :isEditingGlobally="isEditingMode"
          class="section-title"
        />
        <div class="section-line"></div>
        <EditableText 
          contentKey="features-subtitle"
          defaultText="То, что делает игру на Oreol RP по-настоящему незабываемой."
          tag="p"
          :isEditingGlobally="isEditingMode"
          class="section-subtitle"
        />
      </div>
      
      <div class="features-grid">
        <!-- Feature 1 -->
        <div v-reveal class="feature-card glass stagger-1">
          <div class="feature-icon" style="height: 80px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div class="neon-money" style="width: 60px; height: 75px;">
              <div class="bill bill-base"></div>
              <div class="bill bill-f1"></div>
              <div class="bill bill-f2"></div>
              <div class="bill bill-f3"></div>
              <div class="bill bill-f4"></div>
              <div class="bill bill-f5"></div>
              <div class="bill bill-f6"></div>
            </div>
          </div>
          <EditableText 
            contentKey="features-card1-title"
            defaultText="Умная Экономика"
            tag="h3"
            :isEditingGlobally="isEditingMode"
            class="feature-title"
          />
          <EditableText 
            contentKey="features-card1-desc"
            defaultText="Сбалансированная система заработка и трат. От работы таксистом до владения крупным бизнесом."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
        </div>
        <!-- Feature 2 -->
        <div v-reveal class="feature-card glass stagger-2">
          <div class="feature-icon" style="height: 80px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div class="neon-police-light">
              <div class="light light-red"></div>
              <div class="light-center"></div>
              <div class="light light-blue"></div>
            </div>
          </div>
          <EditableText 
            contentKey="features-card2-title"
            defaultText="Гос. Структуры"
            tag="h3"
            :isEditingGlobally="isEditingMode"
            class="feature-title"
          />
          <EditableText 
            contentKey="features-card2-desc"
            defaultText="Проработанные системы для полиции и медиков с уникальным функционалом."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
        </div>
        <!-- Feature 3 -->
        <div v-reveal class="feature-card glass stagger-3">
          <div class="feature-icon" style="height: 80px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div class="neon-gun">
              <div class="gun-barrel"></div>
              <div class="gun-frame"></div>
              <div class="gun-grip"></div>
              <div class="gun-guard"></div>
              <div class="gun-trigger"></div>
              <div class="gun-slide">
                <div class="gun-serrations"></div>
              </div>
            </div>
          </div>
          <EditableText 
            contentKey="features-card3-title"
            defaultText="Криминальный Мир"
            tag="h3"
            :isEditingGlobally="isEditingMode"
            class="feature-title"
          />
          <EditableText 
            contentKey="features-card3-desc"
            defaultText="Банды, кражи, угоны и другие уникальные механики."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
        </div>
        <!-- Feature 4 -->
        <div v-reveal class="feature-card glass stagger-4" style="overflow: hidden;">
          <div class="feature-icon" style="height: 80px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div class="neon-car-container">
              <div class="smoke smoke-1"></div>
              <div class="smoke smoke-2"></div>
              <div class="smoke smoke-3"></div>
              <div class="neon-car">
                <svg viewBox="0 0 512 512" fill="#f97316" style="width: 80px; height: 80px; filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.4));">
                  <g transform="translate(0,512) scale(0.1,-0.1)">
                    <path d="M1685 3513 c-188 -19 -308 -59 -579 -195 -382 -191 -421 -204 -731
-244 -219 -28 -263 -41 -311 -96 -62 -71 -65 -92 -62 -418 3 -286 4 -297 27
-348 15 -32 44 -71 78 -102 58 -53 75 -60 340 -135 l131 -37 31 -63 c121 -245
413 -341 650 -215 60 32 166 130 177 162 5 17 54 18 1164 18 1110 0 1159 -1
1164 -18 11 -32 117 -130 177 -162 237 -126 530 -29 649 213 115 238 15 520
-227 634 -68 33 -88 38 -171 41 -161 7 -281 -42 -384 -157 -82 -91 -117 -188
-118 -323 l0 -78 -1090 0 -1090 0 0 78 c-1 135 -36 232 -118 323 -103 115
-223 164 -384 157 -83 -3 -103 -8 -172 -41 -139 -66 -237 -192 -266 -344 -7
-35 -13 -63 -14 -63 -1 0 -71 20 -155 44 -236 68 -245 78 -249 282 l-3 144 60
0 c49 0 64 4 81 22 22 24 26 58 10 88 -12 22 -61 40 -111 40 l-39 0 0 63 c0
108 14 116 240 142 248 29 356 56 503 123 l78 35 97 -95 c156 -153 217 -178
429 -178 120 0 135 2 153 20 25 25 26 71 1 101 -17 22 -28 24 -130 27 -74 3
-111 8 -111 16 0 17 76 345 81 350 2 2 38 12 79 21 54 12 146 18 333 22 l257
6 0 -206 0 -205 -135 -4 c-123 -3 -136 -5 -156 -25 -27 -27 -29 -75 -4 -103
18 -20 29 -20 899 -20 488 0 964 -5 1066 -10 315 -18 595 -62 810 -126 95 -28
250 -99 250 -114 0 -6 -27 -10 -60 -10 -68 0 -100 -21 -100 -66 0 -63 40 -84
161 -84 l79 0 0 -159 c0 -90 -5 -172 -11 -190 -11 -32 -52 -61 -87 -61 -10 0
-28 -10 -40 -23 -55 -59 0 -137 86 -121 80 15 131 54 173 134 23 43 24 53 24
271 l0 225 -38 76 c-25 51 -53 91 -85 119 -161 143 -663 259 -1217 282 l-70 2
-305 195 c-417 265 -474 294 -670 342 -79 19 -119 21 -545 23 -253 1 -478 1
-500 -2z m1045 -176 c52 -14 125 -38 161 -55 54 -24 351 -206 489 -299 l35
-23 -553 0 -552 0 0 198 c0 109 3 202 8 207 4 4 77 5 162 2 117 -5 178 -12
250 -30z m-1439 -202 c-14 -63 -30 -115 -36 -115 -5 0 -40 30 -77 67 l-68 68
92 47 c51 26 98 47 104 47 7 1 2 -40 -15 -114z m-113 -766 c122 -61 187 -173
180 -309 -16 -272 -334 -402 -541 -221 -20 18 -51 63 -69 99 -28 57 -33 77
-33 142 0 65 5 85 33 142 58 118 155 177 293 178 65 0 84 -4 137 -31z m3102
12 c78 -30 134 -81 172 -159 28 -57 33 -77 33 -142 0 -65 -5 -85 -33 -142 -18
-36 -49 -81 -69 -99 -127 -111 -311 -112 -433 -2 -71 64 -102 129 -108 223 -7
136 58 248 180 309 52 26 73 31 134 31 49 0 91 -7 124 -19z"/>
                    <path d="M989 2133 c-67 -65 -79 -81 -79 -110 0 -42 30 -73 72 -73 26 0 45 13
110 78 87 87 96 115 53 157 -42 43 -68 34 -156 -52z"/>
                    <path d="M4055 2185 c-43 -42 -34 -70 53 -157 65 -65 84 -78 110 -78 42 0 72
31 72 73 0 29 -12 45 -79 110 -88 86 -114 95 -156 52z"/>
                    <path d="M1705 2290 c-25 -28 -23 -76 4 -103 l22 -22 870 0 871 0 25 29 c27
31 25 66 -4 99 -15 16 -71 17 -893 17 -866 0 -877 0 -895 -20z"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <EditableText 
            contentKey="features-card4-title"
            defaultText="Автопарк"
            tag="h3"
            :isEditingGlobally="isEditingMode"
            class="feature-title"
          />
          <EditableText 
            contentKey="features-card4-desc"
            defaultText="Только лор-френдли автомобили с системой тюнинга и обслуживания."
            tag="p"
            :isEditingGlobally="isEditingMode"
          />
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

<style scoped>
/* Анимации и стили для полицейской мигалки (чистый CSS/HTML) */
.neon-police-light {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 24px;
  background: #111827;
  border-radius: 4px;
  padding: 3px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
}

.neon-police-light .light {
  flex: 1;
  height: 100%;
  border-radius: 2px;
}

.neon-police-light .light-red {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  animation: flashRed 1s infinite alternate;
}

.neon-police-light .light-blue {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  animation: flashBlue 1s infinite alternate;
}

.neon-police-light .light-center {
  width: 6px;
  height: 100%;
  background: linear-gradient(to bottom, #9ca3af, #4b5563);
  margin: 0 3px;
  border-radius: 1px;
}

@keyframes flashRed {
  0%, 40% {
    opacity: 1;
    box-shadow: 0 0 15px #ef4444, 0 0 30px #ef4444, inset 0 0 5px rgba(255, 255, 255, 0.5);
  }
  60%, 100% {
    opacity: 0.3;
    box-shadow: 0 0 5px #ef4444;
  }
}

@keyframes flashBlue {
  0%, 40% {
    opacity: 0.3;
    box-shadow: 0 0 5px #3b82f6;
  }
  60%, 100% {
    opacity: 1;
    box-shadow: 0 0 15px #3b82f6, 0 0 30px #3b82f6, inset 0 0 5px rgba(255, 255, 255, 0.5);
  }
}

/* ---------- Анимации Экономики (Деньги) ---------- */
.neon-money {
  position: relative;
}
.bill {
  position: absolute;
  left: 5px;
  bottom: 0px;
  width: 50px;
  height: 30px;
  background: #064e3b;
  border: 2px solid #22c55e;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}
.bill::after {
  content: '$';
  color: #4ade80;
  font-weight: bold;
  font-family: monospace;
  font-size: 16px;
  text-shadow: 0 0 5px #4ade80;
}
.bill-base {
  z-index: 1;
  animation: baseBounce 4s infinite ease-in-out;
}
.bill-f1 { z-index: 2; opacity: 0; animation: fallM1 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
.bill-f2 { z-index: 3; opacity: 0; animation: fallM2 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
.bill-f3 { z-index: 4; opacity: 0; animation: fallM3 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
.bill-f4 { z-index: 5; opacity: 0; animation: fallM4 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
.bill-f5 { z-index: 6; opacity: 0; animation: fallM5 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }
.bill-f6 { z-index: 7; opacity: 0; animation: fallM6 10s infinite cubic-bezier(0.2, 0.8, 0.2, 1); }

@keyframes baseBounce {
  0%, 15% { transform: scale(1); }
  25%, 50% { transform: scale(0.98) translateY(1px); }
  60%, 100% { transform: scale(1); }
}

@keyframes fallM1 {
  0%, 2% { transform: translateY(-40px) rotate(-10deg) scale(1.05); opacity: 0; }
  8% { opacity: 1; transform: translateY(-4px) rotate(2deg) scale(1); }
  10% { transform: translateY(-6px) rotate(2deg) scale(1); }
  12%, 85% { transform: translateY(-4px) rotate(2deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(10deg) scale(0.9); opacity: 0; }
}
@keyframes fallM2 {
  0%, 12% { transform: translateY(-40px) rotate(10deg) scale(1.05); opacity: 0; }
  18% { opacity: 1; transform: translateY(-8px) rotate(-3deg) scale(1); }
  20% { transform: translateY(-10px) rotate(-3deg) scale(1); }
  22%, 85% { transform: translateY(-8px) rotate(-3deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(-5deg) scale(0.9); opacity: 0; }
}
@keyframes fallM3 {
  0%, 22% { transform: translateY(-40px) rotate(-5deg) scale(1.05); opacity: 0; }
  28% { opacity: 1; transform: translateY(-12px) rotate(1deg) scale(1); }
  30% { transform: translateY(-14px) rotate(1deg) scale(1); }
  32%, 85% { transform: translateY(-12px) rotate(1deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(5deg) scale(0.9); opacity: 0; }
}
@keyframes fallM4 {
  0%, 32% { transform: translateY(-40px) rotate(8deg) scale(1.05); opacity: 0; }
  38% { opacity: 1; transform: translateY(-16px) rotate(-4deg) scale(1); }
  40% { transform: translateY(-18px) rotate(-4deg) scale(1); }
  42%, 85% { transform: translateY(-16px) rotate(-4deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(-12deg) scale(0.9); opacity: 0; }
}
@keyframes fallM5 {
  0%, 42% { transform: translateY(-40px) rotate(-8deg) scale(1.05); opacity: 0; }
  48% { opacity: 1; transform: translateY(-20px) rotate(3deg) scale(1); }
  50% { transform: translateY(-22px) rotate(3deg) scale(1); }
  52%, 85% { transform: translateY(-20px) rotate(3deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(8deg) scale(0.9); opacity: 0; }
}
@keyframes fallM6 {
  0%, 52% { transform: translateY(-40px) rotate(12deg) scale(1.05); opacity: 0; }
  58% { opacity: 1; transform: translateY(-24px) rotate(-2deg) scale(1); }
  60% { transform: translateY(-26px) rotate(-2deg) scale(1); }
  62%, 85% { transform: translateY(-24px) rotate(-2deg) scale(1); opacity: 1; }
  92%, 100% { transform: translateY(40px) rotate(-8deg) scale(0.9); opacity: 0; }
}

/* ---------- Анимации Криминал (Пистолет Глок с затвором) ---------- */
.neon-gun {
  position: relative;
  width: 76px;
  height: 52px;
  margin: 0 auto;
  filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.6));
}
.gun-barrel {
  position: absolute;
  left: 2px;
  top: 9px;
  width: 25px;
  height: 4px;
  background: #7f1d1d;
  border: 2px solid #ef4444;
  border-right: none;
  border-radius: 4px 0 0 4px;
  z-index: 1;
}
.gun-frame {
  position: absolute;
  left: 3px;
  top: 15px;
  width: 71px; /* Чуть уже, чтобы сравнять с затвором без выступов */
  height: 8px; /* Сделал тоньше */
  background: #111827;
  border: 2px solid #ef4444;
  border-top: 1px solid #ef4444; /* Линия разделитель */
  border-radius: 0 0 6px 6px;
  z-index: 2;
}
.gun-grip {
  position: absolute;
  right: 5px; /* Смещено на 5px левее */
  top: 21px; /* Поднял выше из-за того что рама стала тоньше */
  width: 20px;
  height: 28px;
  background: #111827;
  border: 2px solid #ef4444;
  border-top: none;
  border-radius: 0 0 6px 6px;
  transform-origin: top center;
  transform: skewX(18deg);
  z-index: 1;
}
.gun-guard {
  position: absolute;
  left: 31px; /* Смещено на 5px левее */
  top: 21px; /* Поднял выше */
  width: 25px;
  height: 14px;
  border: 2px solid #ef4444;
  border-top: none;
  border-right: none;
  border-radius: 0 0 8px 16px;
  z-index: 1;
}
.gun-trigger {
  position: absolute;
  left: 44px; /* Смещено на 5px левее */
  top: 21px; /* Поднял выше */
  width: 3px;
  height: 8px;
  background: #ef4444;
  transform: skewX(15deg);
  border-radius: 0 0 2px 2px;
  z-index: 1;
}
.gun-slide {
  position: absolute;
  left: 3px;
  top: 5px;
  width: 71px; /* Сравнял ширину затвора и рамы */
  height: 11px; /* Сделал тоньше */
  background: #111827;
  border: 2px solid #ef4444;
  border-bottom: 1px solid #ef4444; /* Линия разделитель */
  border-radius: 4px 4px 0 0;
  z-index: 3;
  animation: slideAction 1.5s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 8px;
}
.gun-serrations {
  width: 3px;
  height: 6px;
  background: #ef4444;
  box-shadow: -5px 0 0 #ef4444, -10px 0 0 #ef4444;
  border-radius: 1px;
}
@keyframes slideAction {
  0%, 65% { transform: translateX(0); }
  75% { transform: translateX(16px); } /* Отвод затвора назад */
  85%, 100% { transform: translateX(0); } /* Лязг вперед */
}

/* ---------- Анимации Автопарка (SVG Машина) ---------- */
.neon-car-container {
  width: 100%;
  height: 60px;
  position: relative;
  margin: 0 auto;
}
.neon-car {
  position: absolute;
  left: 0px;
  bottom: -30px; /* Опустили SVG пониже */
  width: 80px;
  height: 80px;
  animation: driveCar 9s infinite;
  z-index: 2;
}

.smoke {
  position: absolute;
  bottom: 5px;
  background: rgba(251, 146, 60, 0.4);
  border-radius: 50%;
  filter: blur(4px);
  opacity: 0;
  z-index: 1;
}
.smoke-1 { width: 20px; height: 20px; animation: carSmoke 9s infinite; }
.smoke-2 { width: 25px; height: 25px; animation: carSmoke 9s infinite 0.1s; }
.smoke-3 { width: 15px; height: 15px; animation: carSmoke 9s infinite 0.2s; }

@keyframes driveCar {
  0% { transform: translateX(-150px); opacity: 0; }
  10% { transform: translateX(50px) rotate(-1deg); opacity: 1; } 
  12%, 67% { transform: translateX(55px) rotate(0); opacity: 1; } /* Встала и стоит 5 секунд */
  68%, 70%, 72%, 74%, 76% { transform: translateX(55px) translateY(-1px); opacity: 1; } /* Вибрация 1 секунда */
  69%, 71%, 73%, 75%, 77% { transform: translateX(55px) translateY(1px); opacity: 1; }
  78% { transform: translateX(53px) rotate(-1deg); opacity: 1; } /* Присяд */
  84% { transform: translateX(250px) rotate(2deg); opacity: 1; } /* Рывок */
  88%, 100% { transform: translateX(350px); opacity: 0; }
}

@keyframes carSmoke {
  0%, 77% { opacity: 0; transform: scale(0.5) translate(0, 0); }
  79% { opacity: 1; transform: scale(1.5) translate(-15px, 0px); }
  84% { opacity: 0.8; transform: scale(2) translate(-30px, -5px); }
  88%, 100% { opacity: 0; transform: scale(3) translate(-50px, -15px); }
}
</style>
