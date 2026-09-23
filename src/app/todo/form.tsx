import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../../hooks/use-theme';
import { useTodos } from '../../hooks/use-todos';

export default function TodoFormScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const isEditing = Boolean(id);
  const { todos, addTodo, updateTodo } = useTodos();

  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const existingTodo = todos.find((t) => t.id === Number(id));
      if (existingTodo) {
        setTitle(existingTodo.title);
        setCompleted(existingTodo.completed);
      }
    }
  }, [id, isEditing, todos]);

  const validate = (): boolean => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('O título da tarefa é obrigatório.');
      return false;
    }
    if (trimmedTitle.length < 3) {
      setErrorMessage('O título deve conter no mínimo 3 caracteres.');
      return false;
    }
    if (trimmedTitle.length > 100) {
      setErrorMessage('O título deve conter no máximo 100 caracteres.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await updateTodo(Number(id), {
          title: title.trim(),
          completed,
        });
      } else {
        await addTodo({
          title: title.trim(),
          completed,
        });
      }
      router.back();
    } catch {
      setErrorMessage('Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
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
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <TouchableOpacity
            style={styles.saveHeaderButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Salvar tarefa"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#208AEF" />
            ) : (
              <Text style={styles.saveHeaderButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View
            style={[
              styles.formCard,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <View style={styles.fieldContainer}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Título da Tarefa <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <Text style={[styles.charCounter, { color: theme.textSecondary }]}>
                  {title.length}/100
                </Text>
              </View>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: errorMessage ? '#EF4444' : 'transparent',
                  },
                ]}
                placeholder="Ex: Finalizar documentação do projeto"
                placeholderTextColor={theme.textSecondary}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                maxLength={100}
                autoFocus={!isEditing}
                accessibilityLabel="Campo para o título da tarefa"
              />

              {errorMessage && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#EF4444"
                  />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLabelContainer}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Status Inicial
                </Text>
                <Text
                  style={[
                    styles.switchDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {completed
                    ? 'A tarefa será criada como concluída'
                    : 'A tarefa será criada como pendente'}
                </Text>
              </View>

              <Switch
                value={completed}
                onValueChange={setCompleted}
                trackColor={{ false: '#767577', true: '#10B981' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Alternar status inicial da tarefa"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Atualizar tarefa' : 'Criar tarefa'}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'save-outline' : 'add-circle-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
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
  saveHeaderButton: {
    padding: 8,
  },
  saveHeaderButtonText: {
    color: '#208AEF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  charCounter: {
    fontSize: 12,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelContainer: {
    flex: 1,
    paddingRight: 16,
  },
  switchDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
