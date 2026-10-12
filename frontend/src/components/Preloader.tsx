import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { UnbookLogo } from './UnbookLogo';

export interface PreloaderProps {
  onComplete?: () => void;
  /** Disparado no instante em que o preloader começa a sair da tela */
  onExitStart?: () => void;
  durationMs?: number;
}

export function Preloader({ onComplete, onExitStart, durationMs = 1250 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isPopOut, setIsPopOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  // Refs para os callbacks: re-renders do pai não reiniciam o preloader
  const onCompleteRef = useRef(onComplete);
  const onExitStartRef = useRef(onExitStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onExitStartRef.current = onExitStart;
  });

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animId: number;

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const linearProgress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(linearProgress);

      setProgress(Math.round(eased * 100));

      if (linearProgress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setProgress(100);
        // Transição de explosão / Pop Out após atingir 100%
        setTimeout(() => {
          setIsPopOut(true);
          onExitStartRef.current?.();
          setTimeout(() => {
            setIsRemoved(true);
            onCompleteRef.current?.();
          }, 520);
        }, 120);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [durationMs]);

  if (isRemoved) return null;

  // Frase dinâmica de acordo com o progresso
  const getStatusText = () => {
    if (progress < 30) return 'INICIANDO UNBOOK 2.0...';
    if (progress < 65) return 'SINCRONIZANDO COM O SIGAA...';
    if (progress < 95) return 'CARREGANDO EMENTAS E NOTAS...';
    return 'TUDO PRONTO!';
  };

  const logoWidth = isMobile ? 240 : 360;

  return (
    <View
      style={[
        styles.overlay,
        isPopOut && styles.overlayFading,
      ]}
      pointerEvents={isPopOut ? 'none' : 'auto'}
    >
      <View style={[styles.centerStage, isPopOut && styles.centerStagePopOut]}>
        {/* Bloco Central com Marca do UnBook + Fita 2.0 sobreposta */}
        <View style={styles.brandWrapper}>
          {/* Logo do UnBook (sem badge estático para inserirmos a fita dinâmica animada) */}
          <View style={styles.logoBox}>
            <UnbookLogo width={logoWidth} showBadge={false} />
          </View>

          {/* Fita 2.0 Neo-Brutalista com Animação de Carimbo (Stamp-in) */}
          <View style={[styles.tapeWrapper, isMobile && styles.tapeWrapperMobile]}>
            {/* Brilhos / Sparkles ao redor da fita */}
            <View style={[styles.sparkleItem, styles.sparkleLeft]}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>

            <View style={styles.tapeBadge}>
              <Text style={[styles.tapeText, isMobile && styles.tapeTextMobile]}>2.0</Text>
            </View>

            <View style={[styles.sparkleItem, styles.sparkleRight]}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
          </View>
        </View>

        {/* Seção da Barra de Carregamento Rápida Neo-Brutalista */}
        <View style={[styles.loaderSection, isMobile && styles.loaderSectionMobile]}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          {/* Status e Porcentagem */}
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{progress}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F6F6F5', // Mesma cor marfim do papel de caderno
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          position: 'fixed',
          transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        } as any)
      : {}),
  },
  overlayFading: {
    opacity: 0,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...(Platform.OS === 'web'
      ? ({
          animation: 'cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  centerStagePopOut: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'preloaderPopOut 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        } as any)
      : {
          transform: [{ scale: 2 }],
          opacity: 0,
        }),
  },
  brandWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapeWrapper: {
    position: 'absolute',
    right: 28,
    bottom: -16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    ...(Platform.OS === 'web'
      ? ({
          animation: 'preloaderStampIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.18s both',
        } as any)
      : {}),
  },
  tapeWrapperMobile: {
    right: 14,
    bottom: -12,
  },
  tapeBadge: {
    backgroundColor: '#FAE100', // Amarelo oficial da fita 2.0
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 3,
    transform: [{ rotate: '-4deg' }],
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  tapeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1.2,
  },
  tapeTextMobile: {
    fontSize: 16,
    letterSpacing: 1,
  },
  sparkleItem: {
    marginHorizontal: 4,
    ...(Platform.OS === 'web'
      ? ({
          animation: 'preloaderSparklePulse 1.4s ease-in-out infinite',
        } as any)
      : {}),
  },
  sparkleLeft: {
    transform: [{ translateY: -10 }],
  },
  sparkleRight: {
    transform: [{ translateY: 8 }],
  },
  sparkleText: {
    fontSize: 18,
    color: '#1349EB', // Azul vibrante
    fontWeight: '900',
  },
  loaderSection: {
    width: 290,
    alignItems: 'center',
  },
  loaderSectionMobile: {
    width: 230,
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    backgroundColor: '#EFEDE1',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    marginBottom: 12,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#009A5E', // Verde oficial UnB
    borderRadius: 4,
    ...(Platform.OS === 'web'
      ? ({
          transition: 'width 0.08s linear',
        } as any)
      : {}),
  },
  statusRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#555555',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  percentBadge: {
    backgroundColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
