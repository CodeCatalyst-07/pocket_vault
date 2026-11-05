// Reusable empty message; optional children hold the screen's action buttons.
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function EmptyState({ icon = 'file-tray-outline', title, message, children }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.primary} accessible={false} />
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {children && <View style={styles.actions}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  message: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
});
