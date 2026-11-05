// Home combines the vault summary, search, filters, and a scrollable purchase list.
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, AppState, FlatList, Keyboard, KeyboardAvoidingView,
  Platform, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import SummaryCard from '../components/SummaryCard';
import { theme } from '../constants/theme';
import { useItems } from '../context/ItemsContext';
import { addMonths, getWarrantyStatus } from '../utils/warranty';

const SORT_OPTIONS = [
  { value: 'expiry', label: 'Expiring soonest' },
  { value: 'recent', label: 'Recently added' },
  { value: 'name', label: 'Name A-Z' },
];
const FAB_SIZE = theme.spacing.xl + theme.spacing.lg;

export default function HomeScreen({ navigation }) {
  const { items, loading, addItem } = useItems();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState(null);
  const [sort, setSort] = useState('expiry');
  const [today, setToday] = useState(() => new Date().toDateString());

  useEffect(() => {
    // Refresh calendar-based statuses after midnight or returning from the background.
    const refreshDay = () => setToday(new Date().toDateString());
    const timer = setInterval(refreshDay, 60 * 1000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshDay();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

  const dashboard = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0 };
    let totalValue = 0;
    const classifiedItems = items.map((item) => {
      // Calculate status once, then reuse it for counts, filtering, and each card.
      const status = getWarrantyStatus(item.expiryDate);
      counts[status] += 1;
      if (status !== 'expired' && Number.isFinite(item.price)) totalValue += item.price;
      return { item, status };
    });
    return { classifiedItems, counts, totalValue };
  }, [items, today]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = dashboard.classifiedItems.filter(({ item, status }) => {
      const matchesSearch = [item.name, item.brand, item.store].some((value) => (
        (value ?? '').toLowerCase().includes(query)
      ));
      const matchesCategory = category === 'All' || item.category === category;
      const matchesStatus = statusFilter === null || status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // filter() creates a new array, so sorting never changes the saved items order.
    return filtered.sort((a, b) => {
      if (sort === 'recent') return b.item.createdAt.localeCompare(a.item.createdAt);
      if (sort === 'name') {
        return a.item.name.toLowerCase().localeCompare(b.item.name.toLowerCase());
      }
      return a.item.expiryDate.localeCompare(b.item.expiryDate);
    });
  }, [dashboard.classifiedItems, search, category, statusFilter, sort]);

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setStatusFilter(null);
    Keyboard.dismiss();
  }

  function openAdd() {
    Keyboard.dismiss();
    navigation.navigate('Add');
  }

  // TEMP: Keep one sample-data action until Phase 4 provides the Add form.
  function addSampleItem() {
    const products = [
      { name: 'Samsung Galaxy M34', brand: 'Samsung', category: 'Mobile', price: 16000 },
      { name: 'Lenovo IdeaPad', brand: 'Lenovo', category: 'Laptop', price: 52000 },
      { name: 'LG Washing Machine', brand: 'LG', category: 'Appliance', price: 28000 },
      { name: 'Sony Headphones', brand: 'Sony', category: 'Electronics', price: 8000 },
    ];
    const product = products[Math.floor(Math.random() * products.length)];
    const warranties = [6, 12, 24];
    const date = new Date();
    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    clearFilters();
    addItem({
      ...product,
      store: 'Sample store',
      purchaseDate: addMonths(dateString, -(1 + Math.floor(Math.random() * 8))),
      warrantyMonths: warranties[Math.floor(Math.random() * warranties.length)],
      notes: 'Temporary sample purchase.',
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loading} edges={['top', 'left', 'right']}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text accessibilityLiveRegion="polite" style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const emptyState = items.length === 0 ? (
    <EmptyState title="Your vault is empty" message="Add a purchase to start keeping track of its warranty.">
      <Pressable
        accessibilityRole="button"
        onPress={openAdd}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.addButtonText}>Add your first item</Text>
      </Pressable>
      {/* TEMP: Remove this small sample button when the Add form is ready. */}
      <Pressable
        accessibilityRole="button"
        onPress={addSampleItem}
        style={({ pressed }) => [styles.sampleButton, pressed && styles.pressed]}
      >
        <Text style={styles.sampleText}>Add sample item</Text>
      </Pressable>
    </EmptyState>
  ) : (
    <EmptyState icon="search-outline" title="No matching items" message="Try a different search, category or warranty status.">
      <Pressable
        accessibilityRole="button"
        onPress={clearFilters}
        style={({ pressed }) => [styles.sampleButton, pressed && styles.pressed]}
      >
        <Text style={styles.sampleText}>Clear filters</Text>
      </Pressable>
    </EmptyState>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={visibleItems}
          keyExtractor={({ item }) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text accessibilityRole="header" style={styles.appName}>PocketVault</Text>
                <Text style={styles.subtitle}>Invoice vault & warranty tracker</Text>
              </View>
              <SummaryCard
                counts={dashboard.counts}
                totalValue={dashboard.totalValue}
                selectedStatus={statusFilter}
                onStatusPress={(status) => setStatusFilter((current) => current === status ? null : status)}
              />
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color={theme.colors.mutedText} accessible={false} />
                <TextInput
                  accessibilityLabel="Search purchases by name, brand or store"
                  placeholder="Search name, brand or store"
                  placeholderTextColor={theme.colors.mutedText}
                  selectionColor={theme.colors.primary}
                  value={search}
                  onChangeText={setSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  onSubmitEditing={Keyboard.dismiss}
                  style={styles.searchInput}
                />
                {search.length > 0 && (
                  <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setSearch('')} style={styles.clearSearch}>
                    <Ionicons name="close-circle" size={20} color={theme.colors.mutedText} accessible={false} />
                  </Pressable>
                )}
              </View>
              <CategoryFilter selectedCategory={category} onSelectCategory={setCategory} />
              <Text style={styles.sortLabel}>Sort by</Text>
              <View style={styles.sortRow}>
                {SORT_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sort === option.value }}
                    onPress={() => setSort(option.value)}
                    style={({ pressed }) => [styles.sortButton, sort === option.value && styles.sortSelected, pressed && styles.pressed]}
                  >
                    <Text style={[styles.sortText, sort === option.value && styles.sortSelectedText]}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
              <Text accessibilityLiveRegion="polite" style={styles.resultCount}>
                {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          }
          ListEmptyComponent={emptyState}
          renderItem={({ item: entry }) => (
            <ItemCard
              item={entry.item}
              status={entry.status}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('ItemDetail', { itemId: entry.item.id });
              }}
            />
          )}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add an item"
          onPress={openAdd}
          style={({ pressed }) => [styles.floatingButton, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={30} color={theme.colors.card} accessible={false} />
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  loadingText: { color: theme.colors.mutedText, marginTop: theme.spacing.md, fontSize: 16 },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    // Leave room to scroll the last card completely above the floating button.
    paddingBottom: FAB_SIZE + theme.spacing.lg * 2,
  },
  header: { marginBottom: theme.spacing.lg },
  appName: { color: theme.colors.text, fontSize: 32, fontWeight: '700' },
  subtitle: { color: theme.colors.mutedText, fontSize: 14, marginTop: theme.spacing.xs },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: theme.colors.border, backgroundColor: theme.colors.card, borderRadius: 12,
    paddingLeft: theme.spacing.md, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1, minWidth: 0, minHeight: theme.spacing.xl + theme.spacing.md,
    color: theme.colors.text, fontSize: 16, padding: theme.spacing.sm,
  },
  clearSearch: { minWidth: theme.spacing.xl + theme.spacing.md, minHeight: theme.spacing.xl + theme.spacing.md, alignItems: 'center', justifyContent: 'center' },
  sortLabel: { color: theme.colors.mutedText, fontSize: 13, marginTop: theme.spacing.md, marginBottom: theme.spacing.sm },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  sortButton: {
    flexGrow: 1, flexBasis: '30%', alignItems: 'center', justifyContent: 'center',
    minHeight: theme.spacing.xl + theme.spacing.md, padding: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, backgroundColor: theme.colors.card,
  },
  sortSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
  sortText: { color: theme.colors.mutedText, fontSize: 12, textAlign: 'center' },
  sortSelectedText: { color: theme.colors.primary, fontWeight: '700' },
  resultCount: { color: theme.colors.mutedText, fontSize: 13, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md },
  addButton: { alignItems: 'center', padding: theme.spacing.md, borderRadius: 12, backgroundColor: theme.colors.primary },
  addButtonText: { color: theme.colors.card, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  sampleButton: { alignItems: 'center', justifyContent: 'center', minHeight: theme.spacing.xl + theme.spacing.md, padding: theme.spacing.sm },
  sampleText: { color: theme.colors.primary, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  floatingButton: {
    position: 'absolute', right: theme.spacing.lg, bottom: theme.spacing.lg,
    width: FAB_SIZE, height: FAB_SIZE, borderRadius: FAB_SIZE / 2,
    alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary,
    elevation: 5, shadowColor: theme.colors.primary, shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: theme.spacing.xs }, shadowRadius: theme.spacing.sm,
  },
  pressed: { opacity: 0.7 },
});
