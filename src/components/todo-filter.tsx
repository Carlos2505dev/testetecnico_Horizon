import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/use-theme';
import { StatusFilter } from '../types/todo';

export interface TodoFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onClearCompleted?: () => void;
  completedCount?: number;
}

const FILTER_OPTIONS: {
  label: string;
  value: StatusFilter;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'Todas', value: 'all', icon: 'list-outline' },
  { label: 'Pendentes', value: 'pending', icon: 'time-outline' },
  { label: 'Concluídas', value: 'completed', icon: 'checkmark-done-outline' },
];

export function TodoFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onClearCompleted,
  completedCount = 0,
}: TodoFilterProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar tarefas pelo título..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Campo de busca de tarefas"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContent}
        style={styles.chipsScrollView}
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = selectedStatus === option.value;
          const contentColor = isActive ? theme.secondary : theme.textSecondary;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? theme.primary
                    : theme.backgroundElement,
                },
              ]}
              onPress={() => onStatusChange(option.value)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filtro: ${option.label}`}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={contentColor}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    color: contentColor,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {selectedStatus === 'completed' && completedCount > 0 && onClearCompleted && (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}
            onPress={onClearCompleted}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Limpar todas as tarefas concluídas"
          >
            <Ionicons name="trash-outline" size={14} color={theme.danger} />
            <Text style={[styles.clearButtonText, { color: theme.danger }]}>
              Limpar ({completedCount})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  chipsScrollView: {
    marginTop: 12,
  },
  chipsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    marginLeft: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
