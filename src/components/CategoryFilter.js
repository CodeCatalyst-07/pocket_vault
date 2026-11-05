// A horizontal list lets Home select exactly one category, including All.
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { theme } from '../constants/theme';

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
    >
      {['All', ...CATEGORIES].map((category) => {
        const selected = selectedCategory === category;
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={category === 'All' ? 'All categories' : category}
            accessibilityState={{ selected }}
            onPress={() => onSelectCategory(category)}
            style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    justifyContent: 'center',
    minHeight: theme.spacing.xl + theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: theme.colors.mutedText,
    fontSize: 14,
  },
  selectedLabel: {
    color: theme.colors.card,
    fontWeight: '600',
  },
});
