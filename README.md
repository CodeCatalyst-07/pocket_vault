# PocketVault

A local invoice vault and warranty tracker for keeping purchase records and remembering warranty expiry dates.

Phase 2 adds local item storage, shared item state, and warranty calculations to the navigation foundation. Home contains a temporary sample-item test list. The real UI, invoice uploads, and notifications will be added in later phases.

## How to run

Install Node.js LTS on your computer and Expo Go on your phone. In this project folder, run:

```sh
npm install
npx expo start
```

Keep your computer and phone on the same Wi-Fi network. Scan the terminal QR code in Expo Go on Android, or with the Camera app on iPhone, to open PocketVault in Expo Go.

On Home, tap **Add sample item** to test adding purchases and **Delete** to remove them. Restart the app to check that saved items return. **Open sample item** still opens the placeholder details screen above the tabs. Use the header back button to return, and tap **Add** or **Settings** to try the other tabs.

## Folder structure

```text
App.js                         Items provider, navigation container, and status bar
app.json                       Expo app name, slug, and settings
index.js                       Expo app entry point
assets/                        App icons from the blank Expo template
src/
  navigation/AppNavigator.js   Bottom tabs inside a native stack
  screens/HomeScreen.js        Temporary sample-item storage test list
  screens/AddItemScreen.js     Add purchase placeholder
  screens/SettingsScreen.js    Settings placeholder
  screens/ItemDetailScreen.js  Invoice and warranty details placeholder
  constants/theme.js           Colours, spacing, and 30-day expiry threshold
  constants/categories.js      Allowed product categories
  components/                  Future reusable UI components
  services/storage.js          Reads and writes the saved items array
  utils/warranty.js            Pure warranty date and status calculations
  context/ItemsContext.js      Shared items, loading state, and item actions
```

The empty `components` folder contains a `.gitkeep` file so it can be included when you commit. The app uses plain JavaScript, functional components, Expo's managed workflow, and React Navigation. It has no backend, database, or external API calls.

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
