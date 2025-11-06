import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import { db, auth } from '../firebase/Config';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posting: false,
      error: '',
      texto: '',
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
        likes: [],
      })
      .then(() => {
        this.setState({ posting: false, error: '', texto: '' });
        if (this.props.navigation) {
          this.props.navigation.navigate('Home');
        }
      })
      .catch(() => {
        this.setState({
          posting: false,
          error: 'No se pudo crear el post.',
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Header Sesh */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Sesh</Text>
        </View>

        <Text style={styles.title}>Nuevo post</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribí tu mensaje"
          value={this.state.texto}
          onChangeText={(text) => this.setState({ texto: text })}
          multiline
        />

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4FC3F7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0288D1',
  },
  logo: { width: 28, height: 28, marginRight: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },

  title: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#0288D1' },
  input: {
    borderWidth: 1,
    borderColor: '#4FC3F7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F9FCFF',
  },
  button: {
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0288D1',
    marginTop: 10,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
  error: { color: '#D32F2F', marginTop: 6 },
});

export default Post;


