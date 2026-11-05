// A small pill shows the warranty status in both text and colour.
import { StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS, theme } from '../constants/theme';

const LABELS = { active: 'Active', expiring: 'Expiring Soon', expired: 'Expired' };

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
