// Displays one purchase; Home supplies the already calculated status.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS, theme } from '../constants/theme';
import { formatDate, getDaysLeftLabel } from '../utils/warranty';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item, status, onPress }) {
  const expiry = formatDate(item.expiryDate);
  const daysLabel = getDaysLeftLabel(item.expiryDate);
  const metadata = [item.brand, item.category].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}. ${metadata}. Warranty ends ${expiry}. ${daysLabel}. Status: ${status === 'expiring' ? 'Expiring soon' : status}.`}
      accessibilityHint="Open item details"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.bar, { backgroundColor: STATUS_COLORS[status] }]} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.metadata}>{metadata}</Text>
        <Text style={styles.expiry}>Warranty ends {expiry}</Text>
        <View style={styles.footer}>
          <Text style={[styles.days, { color: STATUS_COLORS[status] }]}>{daysLabel}</Text>
          <StatusBadge status={status} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  bar: {
    width: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  metadata: {
    color: theme.colors.mutedText,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  expiry: {
    color: theme.colors.mutedText,
    fontSize: 13,
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  days: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
