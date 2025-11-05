import React, { Component } from 'react';
import { View, Text, Pressable } from 'react-native';
import { db, auth } from '../firebase/Config';

class NuevoPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posting: false,
      error: '',
      texto: ""
    };
  }

  onSubmit = () => {
    if (!auth.currentUser) {
      this.setState({ error: 'Debés iniciar sesión para postear.' });
      return;
    }

    this.setState({ posting: true, error: '' });

  

    db.collection('posts')
      .add({
        text: this.state.texto,
        owner: auth.currentUser.email,
        createdAt: Date.now(),
        likes: []
      })
      .then(() => {
        this.setState({ posting: false, error: '' });
        this.props.navigation?.navigate('Home');
      })
      .catch(() => {
        this.setState({ posting: false, error: 'No se pudo crear el post.' });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nuevo post</Text>

        <TextInput onChangeText={(text)=> this.setState({texto: text})} value= {this.state.texto} placeholder="Escribi tu mensaje"/>

        {!!this.state.error && <Text style={styles.error}>{this.state.error}</Text>}

        <Pressable style={styles.button} onPress={this.onSubmit}>
          <Text style={styles.buttonText}>
            {this.state.posting ? 'Publicando...' : 'Publicar'}
          </Text>
        </Pressable>
      </View>
    );
  }
}

const styles = {
  container: { padding: 16 },
  title: { fontSize: 18, marginBottom: 10 },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
    marginTop: 10,
  },
  buttonText: { color: '#fff' },
  error: { color: 'red', marginTop: 6 },
};

export default NuevoPost;