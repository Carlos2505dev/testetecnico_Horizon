import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/use-theme';
import { Todo } from '../types/todo';

export interface TodoItemProps {
  todo: Todo;
  onToggleStatus: (id: number) => void;
  onPress: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggleStatus, onPress, onDelete }: TodoItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
        todo.completed && styles.completedContainer,
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(todo.id)}
      accessibilityRole="button"
      accessibilityLabel={`Tarefa: ${todo.title}`}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggleStatus(todo.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
      >
        <Ionicons
          name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={todo.completed ? '#10B981' : theme.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            todo.completed && [styles.completedText, { color: theme.textSecondary }],
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>

        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: todo.completed
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: todo.completed ? '#10B981' : '#F59E0B' },
              ]}
            >
              {todo.completed ? 'Concluída' : 'Pendente'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Excluir tarefa ${todo.title}`}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  completedContainer: {
    opacity: 0.8,
  },
  checkboxContainer: {
    paddingRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    paddingLeft: 12,
  },
});
