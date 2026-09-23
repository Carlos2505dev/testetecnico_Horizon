import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { DeleteConfirmModal } from '../components/delete-confirm-modal';
import { TodoFilter } from '../components/todo-filter';
import { TodoItem } from '../components/todo-item';
import { EmptyState, ErrorState, LoadingState } from '../components/ui-state';
import { useTheme } from '../hooks/use-theme';
import { useTodos } from '../hooks/use-todos';
import { useToast } from '../components/ui-toast';
import { Todo } from '../types/todo';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    filteredTodos,
    loading,
    error,
    isOfflineMode,
    filters,
    fetchTodos,
    toggleTodoStatus,
    deleteTodo,
    setSearchQuery,
    setStatusFilter,
  } = useTodos();

  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchTodos();
    }, [fetchTodos])
  );

  const handlePressTodo = (id: number) => {
    router.push(`/todo/${id}` as never);
  };

  const handleCreateTodo = () => {
    router.push('/todo/form' as never);
  };

  const handleDeleteRequest = (id: number) => {
    const target = filteredTodos.find((t) => t.id === id);
    if (target) {
      setTodoToDelete(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (todoToDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await deleteTodo(todoToDelete.id);
        showSuccess('Tarefa excluída com sucesso!');
        setTodoToDelete(null);
      } catch {
        showError('Erro ao excluir a tarefa.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            To-Do Horizon
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Gerencie suas tarefas com facilidade
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleCreateTodo}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Criar nova tarefa"
        >
          <Ionicons name="add" size={24} color={theme.secondary} />
        </TouchableOpacity>
      </View>

      {isOfflineMode && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color={theme.warning} />
          <Text style={styles.offlineBannerText}>
            Modo Offline: exibindo tarefas salvas no dispositivo
          </Text>
        </View>
      )}

      <TodoFilter
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={filters.status}
        onStatusChange={setStatusFilter}
      />

      {loading && filteredTodos.length === 0 ? (
        <LoadingState message="Buscando tarefas..." />
      ) : error && filteredTodos.length === 0 ? (
        <ErrorState message={error} onRetry={fetchTodos} />
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggleStatus={toggleTodoStatus}
              onPress={handlePressTodo}
              onDelete={handleDeleteRequest}
            />
          )}
          contentContainerStyle={
            filteredTodos.length === 0 ? styles.emptyListContent : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTodos}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma tarefa encontrada"
              message={
                filters.searchQuery
                  ? `Nenhuma tarefa corresponde à busca "${filters.searchQuery}".`
                  : 'Você ainda não possui tarefas cadastradas.'
              }
              actionLabel="Criar Primeira Tarefa"
              onAction={handleCreateTodo}
            />
          }
        />
      )}

      <DeleteConfirmModal
        visible={todoToDelete !== null}
        todoTitle={todoToDelete?.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTodoToDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  offlineBannerText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});
