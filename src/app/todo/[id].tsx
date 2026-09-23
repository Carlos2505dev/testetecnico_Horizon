import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DeleteConfirmModal } from '../../components/delete-confirm-modal';
import { LoadingState } from '../../components/ui-state';
import { useTheme } from '../../hooks/use-theme';
import { useTodos } from '../../hooks/use-todos';
import { Todo } from '../../types/todo';

export default function TodoDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { todos, loading, toggleTodoStatus, deleteTodo } = useTodos();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      const found = todos.find((t) => t.id === Number(id));
      if (found) {
        setTodo(found);
      }
    }
  }, [id, todos]);

  if (loading && !todo) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <LoadingState message="Carregando detalhes da tarefa..." />
      </SafeAreaView>
    );
  }

  if (!todo) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Detalhes da Tarefa
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.notFoundContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.notFoundTitle, { color: theme.text }]}>
            Tarefa não encontrada
          </Text>
          <Text
            style={[styles.notFoundMessage, { color: theme.textSecondary }]}
          >
            A tarefa solicitada não existe ou foi removida.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.back()}
          >
            <Text style={styles.actionButtonText}>Voltar para a Lista</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggle = async () => {
    await toggleTodoStatus(todo.id);
  };

  const handleEdit = () => {
    router.push(`/todo/form?id=${todo.id}` as never);
  };

  const handleConfirmDelete = async () => {
    await deleteTodo(todo.id);
    setShowDeleteModal(false);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Detalhes da Tarefa
        </Text>
        <TouchableOpacity
          style={styles.editHeaderButton}
          onPress={handleEdit}
          accessibilityRole="button"
          accessibilityLabel="Editar tarefa"
        >
          <Ionicons name="create-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <View style={styles.statusRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: todo.completed
                    ? 'rgba(46, 196, 182, 0.15)'
                    : 'rgba(245, 184, 0, 0.15)',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: todo.completed ? theme.success : theme.warning },
                ]}
              >
                {todo.completed ? 'Concluída' : 'Pendente'}
              </Text>
            </View>
            <Text
              style={[styles.idText, { color: theme.textSecondary }]}
            >
              ID: #{todo.id}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {todo.title}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={18}
              color={theme.textSecondary}
            />
            <Text
              style={[styles.infoLabel, { color: theme.textSecondary }]}
            >
              ID do Usuário:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {todo.userId}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: todo.completed
                  ? 'rgba(245, 184, 0, 0.15)'
                  : 'rgba(46, 196, 182, 0.15)',
              },
            ]}
            onPress={handleToggle}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Alternar status da tarefa"
          >
            <Ionicons
              name={
                todo.completed
                  ? 'arrow-undo-outline'
                  : 'checkmark-circle-outline'
              }
              size={20}
              color={todo.completed ? theme.warning : theme.success}
            />
            <Text
              style={[
                styles.toggleButtonText,
                { color: todo.completed ? theme.warning : theme.success },
              ]}
            >
              {todo.completed
                ? 'Marcar como Pendente'
                : 'Marcar como Concluída'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Excluir tarefa"
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Excluir Tarefa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DeleteConfirmModal
        visible={showDeleteModal}
        todoTitle={todo.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editHeaderButton: {
    padding: 8,
  },
  headerRightSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  idText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsSection: {
    marginTop: 24,
    gap: 12,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  notFoundMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
