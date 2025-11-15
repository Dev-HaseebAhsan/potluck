import React from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter a valid email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // NOTE: We'll have authContext handle navigation
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.homeButton}>
        <Text
          style={{ fontSize: 50 }}
          onPress={() => navigation.navigate('Welcome')}
        >🍲</Text>
      </View>
      <Text style={styles.title}>Login</Text>
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
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Create-Account')}
      >
        Don't have an account? Click here to register.
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
  homeButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

