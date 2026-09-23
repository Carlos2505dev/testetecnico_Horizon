import React from 'react';
import {
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
}

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'completed' },
];

export function TodoFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
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

      <View style={styles.chipsContainer}>
        {FILTER_OPTIONS.map((option) => {
          const isActive = selectedStatus === option.value;
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
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? theme.secondary : theme.textSecondary,
                    fontWeight: isActive ? '700' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
  },
});
