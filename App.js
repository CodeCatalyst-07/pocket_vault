// Starts navigation and uses dark status bar text on the light background.
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';
import { ItemsProvider } from './src/context/ItemsContext';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    notification: theme.colors.danger,
  },
};

export default function App() {
  return (
    <ItemsProvider>
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
        <StatusBar style="dark" />
      </NavigationContainer>
    </ItemsProvider>
  );
}
