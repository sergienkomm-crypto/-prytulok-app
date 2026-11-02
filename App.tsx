import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Притулок</Text>
      <Text>Застосунок запущено ✅</Text>
      <Text>Expo SDK 58 · React Native · TypeScript</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '600' },
});
