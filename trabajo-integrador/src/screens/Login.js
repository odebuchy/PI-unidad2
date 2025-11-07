import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase/Config';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', loggedIn: false };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('Nav');
      }
    });
  }

  onSubmit() {
    let email = this.state.email;
    let password = this.state.password;

    if (!email.includes('@')) {
      this.setState({ error: 'Email mal formateado' });
      return;
    }
    if (password.length < 6) {
      this.setState({ error: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loggedIn: true, error: '' });
        this.props.navigation.navigate('Nav');
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Sesh</Text>
        </View>

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />

        {!!this.state.error && <Text style={styles.error}>{this.state.error}</Text>}

        <Pressable style={styles.button} onPress={() => this.onSubmit()}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>

        <Pressable
          style={styles.linkButton}
          onPress={() => this.props.navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>No tengo cuenta</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#4FC3F7', paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#0288D1',
  },
  logo: { width: 28, height: 28, marginRight: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },

  title: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#0288D1' },
  input: {
    height: 20, paddingVertical: 15, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#4FC3F7', borderRadius: 6, marginVertical: 10,
  },
  button: {
    backgroundColor: '#4FC3F7', paddingHorizontal: 10, paddingVertical: 8,
    alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#0288D1', marginTop: 10,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
  error: { color: '#D32F2F', marginTop: 6 },
  linkButton: { marginTop: 10, alignItems: 'center' },
  linkText: { color: '#0288D1', fontWeight: '600' },
});

export default Login;


