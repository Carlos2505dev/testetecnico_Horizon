import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/use-theme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Erro de Conexão',
  message = 'Não foi possível carregar as tarefas. Verifique sua conexão com a internet.',
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color="#EF4444" />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Ionicons name="reload-outline" size={16} color={theme.secondary} style={styles.buttonIcon} />
          <Text style={[styles.buttonText, { color: theme.secondary }]}>Tentar Novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 280,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#208AEF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
