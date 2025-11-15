import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function AccountCreationScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccountCreation = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('AccountSetup');
    }catch (error) {
      Alert.alert('Account Creation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        title={loading ? 'Creating Account...' : 'Create Account'}
        onPress={handleAccountCreation}
        disabled={loading}
      />
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Click here to login.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.OS === 'web' ? '35%' : 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  registerText: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});