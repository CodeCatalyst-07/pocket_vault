# PocketVault

A local invoice vault and warranty tracker for keeping purchase records and remembering warranty expiry dates.

Phase 1 contains the app foundation: three tabs, four placeholder screens, and a sample navigation button. Saving items and sending reminders will be added in later phases.

## How to run

Install Node.js LTS on your computer and Expo Go on your phone. In this project folder, run:

```sh
npm install
npx expo start
```

Keep your computer and phone on the same Wi-Fi network. Scan the terminal QR code in Expo Go on Android, or with the Camera app on iPhone, to open PocketVault in Expo Go.

On Home, tap **Open sample item** to open the item details screen above the tabs. Use the header back button to return, and tap **Add** or **Settings** to try the other tabs.

## Folder structure

```text
App.js                         Navigation container and status bar
app.json                       Expo app name, slug, and settings
index.js                       Expo app entry point
assets/                        App icons from the blank Expo template
src/
  navigation/AppNavigator.js   Bottom tabs inside a native stack
  screens/HomeScreen.js        Home placeholder and sample item button
  screens/AddItemScreen.js     Add purchase placeholder
  screens/SettingsScreen.js    Settings placeholder
  screens/ItemDetailScreen.js  Invoice and warranty details placeholder
  constants/theme.js           Shared colours and spacing
  components/                  Future reusable UI components
  services/                    Future local storage and reminders
  utils/                       Future warranty date calculations
  context/                     Future shared items state
```

The empty folders contain `.gitkeep` files so they can be included when you commit. The app uses plain JavaScript, functional components, Expo's managed workflow, and React Navigation. It has no backend, database, external API calls, or storage yet.
