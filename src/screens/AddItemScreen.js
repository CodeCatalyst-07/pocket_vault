// Placeholder for the purchase and warranty form in a later phase.
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function AddItemScreen() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Add - save your purchases here
      </Text>
    </View>
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
});
