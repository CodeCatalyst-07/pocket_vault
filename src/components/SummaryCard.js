// Shows totals for the whole vault; pressing a count selects its status filter.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS, theme } from '../constants/theme';

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
];

export default function SummaryCard({ counts, totalValue, selectedStatus, onStatusPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Warranty overview</Text>
      <View style={styles.row}>
        {STATUSES.map(({ value, label }) => {
          const selected = selectedStatus === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${counts[value]} items`}
              accessibilityHint={selected ? 'Clear this status filter' : 'Filter purchases by this status'}
              accessibilityState={{ selected }}
              onPress={() => onStatusPress(value)}
              style={({ pressed }) => [
                styles.countButton,
                selected && styles.selected,
                selected && { borderColor: STATUS_COLORS[value] },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.count, { color: STATUS_COLORS[value] }]}>{counts[value]}</Text>
              <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.total}>
        Total value covered: <Text style={styles.amount}>Rs {totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  countButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.card,
    borderRadius: 12,
  },
  selected: {
    backgroundColor: theme.colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    color: theme.colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  selectedLabel: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  total: {
    color: theme.colors.mutedText,
    fontSize: 14,
    marginTop: theme.spacing.md,
  },
  amount: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});
