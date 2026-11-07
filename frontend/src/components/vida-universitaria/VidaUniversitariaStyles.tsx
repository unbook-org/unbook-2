import React from 'react';
import { Platform } from 'react-native';

/**
 * Estilos globais (apenas web) da direção visual "Vida Universitária":
 * fonte manuscrita (Caveat) + animações de adesivos, post-its e carimbos.
 *
 * Os elementos recebem `data-vu="nome"` via helper `vu()` e o CSS abaixo
 * aplica a animação correspondente.
 */

export const FONTE_MANUSCRITA = Platform.select({
  web: '"Caveat", "Comic Sans MS", cursive',
  default: undefined,
});

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');

@keyframes vuBob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(-1.5deg); }
}
@keyframes vuBobAlt {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1.5deg); }
}
@keyframes vuDropIn {
  0% { opacity: 0; transform: translateY(-28px) scale(0.9); }
  70% { opacity: 1; transform: translateY(4px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes vuStamp {
  0% { opacity: 0; transform: scale(1.8) rotate(-18deg); }
  60% { opacity: 1; transform: scale(0.92) rotate(-12deg); }
  100% { opacity: 1; transform: scale(1) rotate(-12deg); }
}
@keyframes vuSwing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
@keyframes vuZzz {
  0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translate(10px, -22px) scale(1.15); }
}
@keyframes vuMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes vuFadeUp {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes vuBoardEnter {
  0% { opacity: 0; transform: translateY(18px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes vuPlateiaEnter {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes navSlideDown {
  0% { opacity: 0; transform: translateY(-100%); }
  100% { opacity: 1; transform: translateY(0); }
}

[data-vu="bob"] { animation: vuBob 3.6s ease-in-out infinite; }
[data-vu="bob-alt"] { animation: vuBobAlt 4.2s ease-in-out infinite; }
[data-vu="drop-1"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.10s both; }
[data-vu="drop-2"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both; }
[data-vu="drop-3"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.40s both; }
[data-vu="drop-4"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both; }
[data-vu="drop-5"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.70s both; }
[data-vu="drop-6"] { animation: vuDropIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s both; }
[data-vu="stamp"] { animation: vuStamp 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both; }
[data-vu="fade-up"] { animation: vuFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
[data-vu="fade-up-1"] { animation: vuFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
[data-vu="fade-up-2"] { animation: vuFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
[data-vu="fade-up-3"] { animation: vuFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
[data-vu="board-enter"] { animation: vuBoardEnter 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both; }
[data-vu="migalha-enter"] { animation: vuDropIn 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both; }
[data-vu="plateia-enter"] { animation: vuPlateiaEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
[data-vu="zzz"] { animation: vuZzz 2.4s ease-out infinite; }
[data-vu="marquee"] { animation: vuMarquee 38s linear infinite; }

[data-vu="lift"] {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  cursor: default;
}
[data-vu="lift"]:hover { transform: translateY(-8px) rotate(0deg) !important; }

[data-vu="postit"] {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top center;
}
[data-vu="postit"]:hover { animation: vuSwing 0.7s ease-in-out; }

@media (prefers-reduced-motion: reduce) {
  [data-vu] { animation: none !important; transition: none !important; }
}
`;

/** Marca um elemento para receber uma animação/efeito do CSS acima (web). */
export function vu(nome: string): any {
  return Platform.OS === 'web' ? { dataSet: { vu: nome } } : {};
}

export function VidaUniversitariaStyles() {
  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const id = 'unbook-vida-universitaria';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = CSS;
  }, []);
  return null;
}
