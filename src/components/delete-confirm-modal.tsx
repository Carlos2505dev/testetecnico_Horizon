import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/use-theme';

export interface DeleteConfirmModalProps {
  visible: boolean;
  todoTitle?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  visible,
  todoTitle,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isDeleting ? undefined : onCancel}
    >
      <TouchableWithoutFeedback onPress={isDeleting ? undefined : onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trash-outline" size={32} color="#EF4444" />
              </View>

              <Text style={[styles.title, { color: theme.text }]}>
                Excluir Tarefa
              </Text>

              <Text style={[styles.message, { color: theme.textSecondary }]}>
                Tem certeza que deseja excluir a tarefa{' '}
                {todoTitle ? `"${todoTitle}"` : 'selecionada'}? Esta ação não
                poderá ser desfeita.
              </Text>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { backgroundColor: theme.backgroundSelected },
                    isDeleting && styles.buttonDisabled,
                  ]}
                  onPress={onCancel}
                  disabled={isDeleting}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar exclusão"
                >
                  <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    isDeleting && styles.buttonDisabled,
                  ]}
                  onPress={onConfirm}
                  disabled={isDeleting}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Confirmar exclusão de tarefa"
                >
                  {isDeleting ? (
                    <View style={styles.loadingContent}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.confirmButtonText}>Excluindo...</Text>
                    </View>
                  ) : (
                    <Text style={styles.confirmButtonText}>Excluir</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  iconContainer: {
    padding: 14,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    marginBottom: 16,
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
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 0,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
