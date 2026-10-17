import React from 'react';
import { Platform } from 'react-native';

const CSS_ANIMATIONS = `
@keyframes cartoonMarqueeLeft {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

@keyframes cartoonMarqueeRight {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes buttonSlideShine {
  0% {
    transform: translateX(-160%) skewX(-20deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(260%) skewX(-20deg);
    opacity: 0;
  }
}

@keyframes cartoonPopIn {
  0% {
    opacity: 0;
    transform: scale(0.82) translateY(28px);
  }
  65% {
    opacity: 1;
    transform: scale(1.05) translateY(-5px);
  }
  85% {
    transform: scale(0.98) translateY(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes cartoonFadeUp {
  0% {
    opacity: 0;
    transform: translateY(32px) scale(0.96);
  }
  70% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cartoonFloatSlow {
  0%, 100% {
    transform: translateY(0px) rotate(-3deg);
  }
  50% {
    transform: translateY(-9px) rotate(-1deg);
  }
}

@keyframes cartoonFloatFast {
  0%, 100% {
    transform: translateY(0px) rotate(3deg);
  }
  50% {
    transform: translateY(-7px) rotate(5deg);
  }
}

@keyframes cartoonWiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-4deg); }
  40% { transform: rotate(3deg); }
  60% { transform: rotate(-2deg); }
  80% { transform: rotate(1deg); }
}

@keyframes numberGrowPunch {
  0% {
    transform: scale(0.92);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes modalBackdropFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes modalCartoonPop {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(36px) rotate(-1deg);
  }
  65% {
    opacity: 1;
    transform: scale(1.04) translateY(-6px) rotate(0.5deg);
  }
  85% {
    transform: scale(0.98) translateY(2px) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotate(0deg);
  }
}

@keyframes searchHighlightPulse {
  0%, 100% {
    box-shadow: 4px 4px 0px #1F1F1F;
    transform: scale(1);
  }
  50% {
    box-shadow: 6px 6px 0px #1349EB, 0 0 24px rgba(19, 73, 235, 0.45);
    transform: scale(1.015);
  }
}

/* Pop-in enérgico com rebote cartoon elástico para o logo principal */
@keyframes heroLogoPopIn {
  0% {
    opacity: 0;
    transform: scale(0.1) translateY(50px);
  }
  45% {
    opacity: 1;
    transform: scale(1.22) translateY(-12px);
  }
  70% {
    transform: scale(0.93) translateY(4px);
  }
  86% {
    transform: scale(1.04) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Flutuação sutil contínua para manter a logo viva e em movimento */
@keyframes heroLogoFloat {
  0% {
    transform: translateY(0px) rotate(-0.25deg);
  }
  100% {
    transform: translateY(-7px) rotate(0.35deg);
  }
}

/* Queda com rebote elástico para a pílula de boas-vindas */
@keyframes heroPillDropIn {
  0% {
    opacity: 0;
    transform: translateY(-28px) scale(0.85);
  }
  65% {
    opacity: 1;
    transform: translateY(4px) scale(1.05);
  }
  85% {
    transform: translateY(-2px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Flutuação leve da pílula */
@keyframes heroPillFloat {
  0% {
    transform: translateY(0px) rotate(-0.3deg);
  }
  100% {
    transform: translateY(-3.5px) rotate(0.3deg);
  }
}

/* Entrada dos textos descritivos deslizando suavemente para cima */
@keyframes heroTextSlideUp {
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.98);
  }
  70% {
    opacity: 1;
    transform: translateY(-2px) scale(1.005);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Pop-in saltitante para o botão principal */
@keyframes heroButtonPunchIn {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(24px);
  }
  60% {
    opacity: 1;
    transform: scale(1.09) translateY(-4px);
  }
  82% {
    transform: scale(0.97) translateY(1px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Entrada escalonada dos selos de confiança */
@keyframes heroTrustFadeUp {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Deslize suave de entrada da barra de navegação */
@keyframes navSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes paperTearPeel {
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    transform: translateY(-10px) scaleY(0.94);
    opacity: 0.7;
  }
  60% {
    clip-path: polygon(0 0, 75% 0, 75% 100%, 0 100%);
    transform: translateY(-2px) scaleY(1.02);
    opacity: 0.95;
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translateY(0px) scaleY(1);
    opacity: 1;
  }
}

@keyframes paperTearReveal {
  0% {
    transform: translateY(-14px) rotate(-0.5deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(3px) rotate(0.3deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
}

@keyframes paperTearFallDown {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translateY(35px) rotate(1.2deg);
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
    opacity: 0.95;
  }
  60% {
    transform: translateY(60%) rotate(-2.5deg);
    filter: drop-shadow(0 20px 32px rgba(0, 0, 0, 0.45));
    opacity: 0.7;
  }
  100% {
    transform: translateY(140%) rotate(-5deg);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes seamCutLine {
  0% {
    width: 0%;
    opacity: 1;
  }
  90% {
    width: 100%;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

@keyframes scissorCutTravel {
  0% {
    left: -15px;
    opacity: 0;
    transform: translateY(-50%) rotate(-15deg) scale(0.9);
  }
  15% {
    opacity: 1;
    transform: translateY(-50%) rotate(0deg) scale(1.2);
  }
  85% {
    opacity: 1;
    transform: translateY(-50%) rotate(20deg) scale(1.2);
  }
  100% {
    left: 102%;
    opacity: 0;
    transform: translateY(-50%) rotate(30deg) scale(0.9);
  }
}


@keyframes travelingTearLine {
  0% {
    left: -2%;
    opacity: 1;
  }
  20% {
    left: 22%;
    opacity: 1;
  }
  50% {
    left: 56%;
    opacity: 1;
  }
  80% {
    left: 88%;
    opacity: 1;
  }
  100% {
    left: 110%;
    opacity: 0;
  }
}

@keyframes featDetailEnter {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.97);
  }
  65% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Utilitários Cartoon e Interatividade Web */
.cartoon-spring-transition {
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cartoon-hover-card {
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
}
.cartoon-hover-card:hover {
  transform: translateY(-5px) scale(1.02) rotate(-0.5deg);
  box-shadow: 7px 7px 0px #1F1F1F !important;
}

.cartoon-hover-card-alt {
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
}
.cartoon-hover-card-alt:hover {
  transform: translateY(-5px) scale(1.02) rotate(0.5deg);
  box-shadow: 7px 7px 0px #1F1F1F !important;
}

/* Efeito de fita adesiva */
.washi-tape {
  position: relative;
}
.washi-tape::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 80px;
  height: 22px;
  background-color: rgba(241, 195, 33, 0.7);
  border: 1px dashed rgba(31, 31, 31, 0.35);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  z-index: 10;
  pointer-events: none;
}
/* Seletores diretos para garantia total de animação nativa no browser */
#hero-logo-container {
  animation: heroLogoPopIn 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s both !important;
  transform-origin: center center;
}

#hero-logo-svg {
  animation: heroLogoFloat 4s ease-in-out 0.95s infinite alternate !important;
  transform-origin: center center;
}

#hero-welcome-pill {
  animation: heroPillDropIn 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) 0.04s both !important;
}

#hero-description {
  animation: heroTextSlideUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both !important;
}

#hero-button-group {
  animation: heroButtonPunchIn 0.76s cubic-bezier(0.34, 1.56, 0.64, 1) 0.44s both !important;
}

#hero-trust-row {
  animation: heroTrustFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.58s both !important;
}

#app-navbar {
  animation: navSlideDown 0.45s cubic-bezier(0.16, 1, 0.3, 1) both !important;
}

#paper-tear-overlay {
  transform-origin: top right !important;
  -webkit-transform-origin: top right !important;
  will-change: transform, opacity;
}
`;

export function CartoonAnimationStyles() {
  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }
    const styleId = 'unbook-cartoon-animations';
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      el.textContent = CSS_ANIMATIONS;
      document.head.appendChild(el);
    } else {
      el.textContent = CSS_ANIMATIONS;
    }
  }, []);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <style
      // @ts-ignore - React Native Web aceita elemento style
      dangerouslySetInnerHTML={{ __html: CSS_ANIMATIONS }}
    />
  );
}
