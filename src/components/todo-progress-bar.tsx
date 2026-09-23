import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/use-theme';

export interface TodoProgressBarProps {
  total: number;
  completed: number;
}

export function TodoProgressBar({ total, completed }: TodoProgressBarProps) {
  const theme = useTheme();

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Progresso das Tarefas
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {completed} de {total} concluídas ({percentage}%)
        </Text>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: theme.backgroundSelected },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.success,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
