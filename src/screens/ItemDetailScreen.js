// Minimal details screen: look up the selected purchase by its saved ID.
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useItems } from '../context/ItemsContext';
import { formatDate } from '../utils/warranty';

export default function ItemDetailScreen({ route }) {
  const { getItemById, loading } = useItems();
  const item = getItemById(route?.params?.itemId);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Text accessibilityRole="header" style={styles.title}>
        {loading ? 'Loading...' : item ? item.name : 'Item not found'}
      </Text>
      {!loading && item && <Text style={styles.expiry}>Warranty ends {formatDate(item.expiryDate)}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  expiry: {
    color: theme.colors.mutedText,
    fontSize: 16,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
