import React, { Component } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { auth, db } from '../firebase/Config';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      error: '',
      registered: false,
    };
  }

  onSubmit() {
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        // Guardamos datos del usuario en la colección 'users'
        db.collection('users').add({
          owner: auth.currentUser.email,
          username: this.state.username,
          createdAt: Date.now(),
        })
        .then(() => {
          this.setState({ registered: true, error: '' });
          this.props.navigation.navigate('Login');
        })
        .catch(e => console.log(e));
      })
      .catch(error => {
        this.setState({ error: 'Fallo en el registro.' });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Registro</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="email"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder="username"
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />

        <TextInput
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        />

        {!!this.state.error && (
          <Text style={{ color: 'red' }}>{this.state.error}</Text>
        )}

        <Pressable style={styles.button} onPress={() => this.onSubmit()}>
          <Text style={styles.buttonText}>Registrate</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Ya tengo cuenta</Text>
        </Pressable>

        <View style={{ marginTop: 20 }}>
          <Text>Datos ingresados:</Text>
          <Text>Email: {this.state.email}</Text>
          <Text>Usuario: {this.state.username}</Text>
          <Text>Password: {this.state.password}</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  input: {
    height: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
};

export default Register;