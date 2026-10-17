import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useInView<T = any>(options: UseInViewOptions = {}) {
  const { threshold = 0.15, triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(
    Platform.OS !== 'web' ||
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
  );

  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const node = ref.current as unknown as HTMLElement | null;
    if (!node) {
      // Caso não tenha elemento acoplado ainda, ativa por precaução após timeout
      const timeout = setTimeout(() => setIsInView(true), 300);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  return [ref, isInView] as const;
}
