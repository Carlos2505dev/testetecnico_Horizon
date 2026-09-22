import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando tarefas...' }: LoadingStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#208AEF" />
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 250,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});
