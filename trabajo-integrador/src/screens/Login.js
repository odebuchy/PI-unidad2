import React, { Component } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { auth } from '../firebase/Config';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', loggedIn: false };
  }

  onSubmit() {
    let email = this.state.email;
    let password = this.state.password;

    if (!email.includes('@')) {
      this.setState({ error: 'Email mal formateado' });
      return;
    }
    if (password.length < 6) {
      this.setState({ error: 'La password debe tener una longitud mínima de 6 caracteres' });
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loggedIn: true, error: '' });
        this.props.navigation.navigate('Nav'); // Redirige al Home
      })
      .catch(() => {
        this.setState({ error: 'Credenciales incorrectas' });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="email"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        />

        {!!this.state.error && <Text style={{ color: 'red' }}>{this.state.error}</Text>}

        <Pressable style={styles.button} onPress={() => this.onSubmit()}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>No tengo cuenta</Text>
        </Pressable>

        <View style={{ marginTop: 20 }}>
          <Text>Datos ingresados:</Text>
          <Text>Email: {this.state.email}</Text>
          <Text>Password: {this.state.password}</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: { paddingHorizontal: 10, marginTop: 20 },
  input: {
    height: 20, paddingVertical: 15, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#ccc', borderStyle: 'solid',
    borderRadius: 6, marginVertical: 10,
  },
  button: {
    backgroundColor: '#28a745', paddingHorizontal: 10, paddingVertical: 6,
    alignItems: 'center', borderRadius: 4, borderWidth: 1,
    borderStyle: 'solid', borderColor: '#28a745', marginTop: 10,
  },
  buttonText: { color: '#fff' },
};

export default Login;
