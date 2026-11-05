// Placeholder home screen with a temporary stack navigation button.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Home - your items will appear here
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('ItemDetail')}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Open sample item</Text>
      </Pressable>
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
  button: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
