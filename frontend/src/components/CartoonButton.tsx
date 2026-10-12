import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../constants/theme';

export interface CartoonButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  showSlideArrow?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export function CartoonButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  showSlideArrow = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}: CartoonButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          textColor: theme.colors.white,
          borderColor: theme.colors.dark,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          textColor: theme.colors.dark,
          borderColor: theme.colors.dark,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.danger,
          textColor: theme.colors.white,
          borderColor: theme.colors.dark,
        };
      case 'dark':
        return {
          backgroundColor: theme.colors.dark,
          textColor: theme.colors.white,
          borderColor: theme.colors.dark,
        };
      case 'white':
        return {
          backgroundColor: theme.colors.white,
          textColor: theme.colors.dark,
          borderColor: theme.colors.dark,
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.white,
          borderColor: theme.colors.dark,
        };
    }
  };

  const vStyles = getVariantStyles();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 12,
        };
      case 'lg':
        return {
          paddingVertical: 15,
          paddingHorizontal: 36,
          fontSize: 15,
        };
      case 'md':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 26,
          fontSize: 13.5,
        };
    }
  };

  const sStyles = getSizeStyles();

  // Feixe de reflexo 100% gradiente suave sem bordas quadradas
  const shineGradient =
    variant === 'white'
      ? 'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.06) 50%, rgba(255,255,255,0) 100%)'
      : 'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%)';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.baseButton,
        {
          backgroundColor: vStyles.backgroundColor,
          borderColor: vStyles.borderColor,
          paddingVertical: sStyles.paddingVertical,
          paddingHorizontal: sStyles.paddingHorizontal,
        },
        isHovered && styles.hoveredButton,
        pressed && styles.pressedButton,
        style,
      ]}
    >
      {/* Feixe animado de luz 100% gradiente (Slide Shine Effect suave sem corte quadrado) */}
      {Platform.OS === 'web' && (
        <View
          style={[
            styles.shineBeam,
            {
              // @ts-ignore
              background: shineGradient,
            },
            isHovered && styles.shineBeamHovered,
          ]}
          pointerEvents="none"
        />
      )}

      {/* Conteúdo do Botão com ícones e texto */}
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.baseText,
              {
                color: vStyles.textColor,
                fontSize: sStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}

        {showSlideArrow && (
          <Text
            style={[
              styles.slideArrow,
              { color: vStyles.textColor },
              isHovered && styles.slideArrowHovered,
            ]}
          >
            ➜
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)', // Previne bug de corte de overflow em webkit
          transition:
            'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  hoveredButton: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-3px) scale(1.02)',
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  pressedButton: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px) scale(0.98)',
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  shineBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0,
    transform: [{ translateX: -120 }],
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateX(-110%)',
          transition: 'transform 0.55s ease-out, opacity 0.25s ease',
          pointerEvents: 'none',
        } as any)
      : {}),
  },
  shineBeamHovered: {
    opacity: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateX(110%)',
          opacity: 1,
        } as any)
      : {}),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  slideArrow: {
    fontSize: 13,
    fontWeight: '900',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  slideArrowHovered: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateX(4px)',
        } as any)
      : {}),
  },
});
