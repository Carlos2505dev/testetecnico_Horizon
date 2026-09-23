import * as Haptics from 'expo-haptics';

export const hapticFeedback = {
  selection() {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignora falhas em plataformas sem suporte
    }
  },
  success() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
    }
  },
  warning() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
    }
  },
  error() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
    }
  },
  impactLight() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
    }
  },
  impactMedium() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
    }
  },
};
