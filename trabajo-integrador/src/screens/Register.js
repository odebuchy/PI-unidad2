import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { auth, db } from '../firebase/Config';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', username: '', password: '', error: '', registered: false };
  }

  onSubmit() {
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        return db.collection('users').add({
          email: this.state.email,
          username: this.state.username,
          createdAt: Date.now(),
        });
      })
      .then(() => {
        this.setState({ registered: true, error: '' });
        this.props.navigation.navigate('Login');
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

        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          onChangeText={(text) => this.setState({ username: text })}
          value={this.state.username}
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
          <Text style={styles.buttonText}>Registrate</Text>
        </Pressable>

        <Pressable style={styles.linkButton} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.linkText}>Ya tengo cuenta</Text>
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

export default Register;
