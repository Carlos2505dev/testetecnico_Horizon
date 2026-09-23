import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  action?: ToastAction;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void;
  showSuccess: (message: string, action?: ToastAction) => void;
  showError: (message: string, action?: ToastAction) => void;
  showInfo: (message: string, action?: ToastAction) => void;
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
    (message: string, type: ToastType = 'info', action?: ToastAction) => {
      const id = Math.random().toString();
      setToast({ id, type, message, action });

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        hideToast();
      }, 4000);
    },
    [fadeAnim, hideToast]
  );

  const showSuccess = useCallback((msg: string, action?: ToastAction) => showToast(msg, 'success', action), [showToast]);
  const showError = useCallback((msg: string, action?: ToastAction) => showToast(msg, 'error', action), [showToast]);
  const showInfo = useCallback((msg: string, action?: ToastAction) => showToast(msg, 'info', action), [showToast]);

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
        <SafeAreaView pointerEvents="box-none" style={styles.container}>
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

            {toast.action && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  toast.action?.onPress();
                  hideToast();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionText, { color: getToastColors(toast.type).text }]}>
                  {toast.action.label}
                </Text>
              </TouchableOpacity>
            )}
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
  actionButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
