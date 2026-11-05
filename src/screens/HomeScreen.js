// TEMP: Phase 2 storage test screen; replace this with the real UI in a later phase.
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { useItems } from '../context/ItemsContext';
import { addMonths, formatDate, getDaysLeft, getWarrantyStatus } from '../utils/warranty';

const SAMPLE_PRODUCTS = [
  { name: 'Samsung Galaxy M34', brand: 'Samsung', category: 'Mobile', price: 16000 },
  { name: 'Lenovo IdeaPad', brand: 'Lenovo', category: 'Laptop', price: 52000 },
  { name: 'LG Washing Machine', brand: 'LG', category: 'Appliance', price: 28000 },
  { name: 'Sony Headphones', brand: 'Sony', category: 'Electronics', price: 8000 },
];

const STATUS_COLORS = {
  active: theme.colors.success,
  expiring: theme.colors.warning,
  expired: theme.colors.danger,
};

export default function HomeScreen({ navigation }) {
  const { items, loading, addItem, deleteItem } = useItems();

  function addSampleItem() {
    const sample = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    const warranties = [6, 12, 24];
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    // Keep sample names distinct, including after restarting the app.
    let number = items.length + 1;
    while (items.some((item) => item.name === `${sample.name} (sample ${number})`)) {
      number += 1;
    }

    addItem({
      ...sample,
      name: `${sample.name} (sample ${number})`,
      store: 'Sample store',
      purchaseDate: addMonths(todayString, -(1 + Math.floor(Math.random() * 8))),
      warrantyMonths: warranties[Math.floor(Math.random() * warranties.length)],
      notes: 'Temporary sample item for Phase 2 testing.',
    });
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text accessibilityLiveRegion="polite" style={styles.message}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>Temporary item test</Text>
          <Button title="Add sample item" color={theme.colors.primary} onPress={addSampleItem} />
          <View style={styles.navigationButton}>
            <Button
              title="Open sample item"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('ItemDetail')}
            />
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.message}>No items saved. Add a sample item to test storage.</Text>}
      renderItem={({ item }) => {
        const status = getWarrantyStatus(item.expiryDate);
        return (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.message}>Expiry: {formatDate(item.expiryDate)}</Text>
            <Text style={styles.message}>Days left: {getDaysLeft(item.expiryDate)}</Text>
            <Text style={[styles.status, { color: STATUS_COLORS[status] }]}>Status: {status}</Text>
            <Button
              title="Delete"
              accessibilityLabel={`Delete ${item.name}`}
              color={theme.colors.danger}
              onPress={() => deleteItem(item.id)}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  navigationButton: {
    marginTop: theme.spacing.sm,
  },
  item: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: 8,
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  message: {
    color: theme.colors.mutedText,
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
});
