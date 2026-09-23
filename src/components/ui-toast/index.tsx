import React, { createContext, useCallback, useContext, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/use-theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const theme = useTheme();

  const hideToast = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [fadeAnim]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString();
      setToast({ id, type, message });

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        hideToast();
      }, 3000);
    },
    [fadeAnim, hideToast]
  );

  const showSuccess = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const showError = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const showInfo = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: theme.success,
          text: '#FFFFFF',
          icon: 'checkmark-circle-outline' as const,
        };
      case 'error':
        return {
          bg: theme.danger,
          text: '#FFFFFF',
          icon: 'alert-circle-outline' as const,
        };
      case 'warning':
        return {
          bg: theme.warning,
          text: theme.secondary,
          icon: 'warning-outline' as const,
        };
      case 'info':
      default:
        return {
          bg: theme.primary,
          text: theme.secondary,
          icon: 'information-circle-outline' as const,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      {toast && (
        <SafeAreaView pointerEvents="none" style={styles.container}>
          <Animated.View
            style={[
              styles.toast,
              {
                backgroundColor: getToastColors(toast.type).bg,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name={getToastColors(toast.type).icon}
              size={20}
              color={getToastColors(toast.type).text}
            />
            <Text style={[styles.message, { color: getToastColors(toast.type).text }]}>
              {toast.message}
            </Text>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: '100%',
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
