# PocketVault

A local invoice vault and warranty tracker for keeping purchase records and remembering warranty expiry dates.

Phase 3 adds the Home dashboard on top of local item storage and warranty calculations. Add/Edit forms, invoice uploads, full item details, and notifications will be added in later phases.

## Features

- Home shows Active, Expiring Soon, and Expired counts for the whole vault. Tap a count to filter the list; tap it again to clear that status filter.
- Total value covered adds the prices of active and expiring items, ignoring expired items and purchases without a price.
- Search by purchase name, brand, or store without worrying about capital letters. Combine search with one category and a warranty status.
- Sort by Expiring soonest (expiry date ascending, the default), Recently added, or Name A-Z. Search, category, status, and sorting work together.
- Purchase cards show the name, brand, category, formatted expiry, days left, and a text status badge. Tap a card to see its name and expiry on the minimal details screen.
- The empty vault offers an Add action and one temporary sample-item button. A separate no-results message lets you clear filters. The floating + button also opens the Add tab, which is still a placeholder.
- The dashboard scrolls on small phones, handles safe areas and the search keyboard, and leaves room below the list for the floating button.

## How to run

Install Node.js LTS on your computer and Expo Go on your phone. In this project folder, run:

```sh
npm install
npx expo start
```

Keep your computer and phone on the same Wi-Fi network. Scan the terminal QR code in Expo Go on Android, or with the Camera app on iPhone, to open PocketVault in Expo Go.

If the vault is empty, tap **Add sample item** to create a test purchase. The sample button disappears once an item exists. Restart the app to check that saved items return, or tap a purchase card to open its details. The Add tab and + button lead to the placeholder Add screen until Phase 4.

## Folder structure

```text
App.js                         Items provider, navigation container, and status bar
app.json                       Expo app name, slug, and settings
index.js                       Expo app entry point
assets/                        App icons from the blank Expo template
src/
  navigation/AppNavigator.js   Bottom tabs inside a native stack
  screens/HomeScreen.js        Dashboard, search, filters, sorting, and item list
  screens/AddItemScreen.js     Add purchase placeholder
  screens/SettingsScreen.js    Settings placeholder
  screens/ItemDetailScreen.js  Selected purchase name and warranty expiry
  constants/theme.js           Colours, spacing, and 30-day expiry threshold
  constants/categories.js      Allowed product categories
  components/StatusBadge.js    Text and colour pill for a warranty status
  components/SummaryCard.js    Status counts and total value covered
  components/ItemCard.js       Tappable purchase and warranty summary
  components/CategoryFilter.js Horizontal category chips
  components/EmptyState.js     Reusable empty message with optional actions
  services/storage.js          Reads and writes the saved items array
  utils/warranty.js            Pure warranty date and status calculations
  context/ItemsContext.js      Shared items, loading state, and item actions
```

The app uses plain JavaScript, functional components, Expo's managed workflow, and React Navigation. It has no backend, database, or external API calls.

## Data and storage

Each purchase is a plain JavaScript object with this shape (`price` and `store` are optional):

```js
{
  id: 'unique-string',
  name: 'Samsung Galaxy M34',
  brand: 'Samsung',
  category: 'Mobile',
  price: 16000,
  store: 'Sample store',
  purchaseDate: '2025-11-05',
  warrantyMonths: 12,
  expiryDate: '2026-11-05',
  invoiceUri: null,
  notes: '',
  notificationIds: [],
  createdAt: '2025-11-05T10:00:00.000Z'
}
```

Categories are Mobile, Laptop, Appliance, Electronics, Furniture, Vehicle, and Other. The context creates `id` and `createdAt`, calculates `expiryDate`, and starts `notificationIds` as an empty array. Updating an item recalculates its expiry date; callers do not type it themselves.

Data flows from **screen → ItemsContext → storage.js → AsyncStorage**. `ItemsProvider` loads saved items on startup and exposes `items`, `loading`, `addItem`, `updateItem`, `deleteItem`, and `getItemById` through `useItems()`. Item actions are disabled until loading finishes. Add, update, and delete actions save the whole array in order as JSON under the single key `pocketvault_items`, locally on the phone. A storage load error returns an empty array, and storage errors are logged with `console.warn`.

Expiry is the purchase date plus the warranty months, clamped to the final day of the target month when necessary (31 Jan 2026 plus one month becomes 28 Feb 2026). Days left compares local calendar dates, ignoring the current time and daylight-saving hour changes. A negative result is **expired**, 0–30 days is **expiring**, and more than 30 days is **active**. The threshold is `EXPIRING_SOON_DAYS` in `theme.js`. On the expiry date itself, an item is still expiring.

Home uses one `useMemo` to calculate each item's status and the whole-vault totals. A second `useMemo` combines search, category, and status filters before sorting a new array, leaving saved item order unchanged. Cards reuse that calculated status. `getDaysLeftLabel` produces text such as "1 day left", "Expires today", or "Expired 12 days ago". Statuses refresh when the local day changes or the app returns from the background.
