import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍲 Potluck</Text>
      <Text style={styles.subtitle}>A recipe sharing platform</Text>
      <Button 
        title="Login Here" 
        onPress={() => navigation.navigate('Login')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  }
});