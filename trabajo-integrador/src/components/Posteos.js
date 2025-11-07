import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config';
import firebase from 'firebase/app';
import 'firebase/firestore';

class Posteos extends Component {
  constructor(props) {
    super(props);
    this.state = { likeado: false };
  }

  componentDidMount() {
    let tieneData = this.props && this.props.data && this.props.data.data;
    let likes = tieneData && this.props.data.data.likes ? this.props.data.data.likes : [];
    let user = auth.currentUser ? auth.currentUser.email : null;

    if (user && likes.includes(user)) {
      this.setState({ likeado: true });
    } else {
      this.setState({ likeado: false });
    }
  }

  likear = () => {
    let user = auth.currentUser ? auth.currentUser.email : null;
    if (!user) return;

    let postId = this.props && this.props.data ? this.props.data.id : null;
    if (!postId) return;

    if (this.state.likeado) {
      db.collection('posts')
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(user) })
        .then(() => this.setState({ likeado: false }))
        .catch(() => console.log('Error al quitar like'));
    } else {
      db.collection('posts')
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.arrayUnion(user) })
        .then(() => this.setState({ likeado: true }))
        .catch(() => console.log('Error al dar like'));
    }
  };

  render() {
    let tieneData = this.props && this.props.data && this.props.data.data;
    let dato = tieneData ? this.props.data.data : {};
    let owner = dato.owner ? dato.owner : '';
    let text = dato.text ? dato.text : '';
    let likes = dato.likes ? dato.likes : [];

    return (
      <View style={styles.card}>
        <Text style={styles.user}>{owner}</Text>
        <Text style={styles.text}>{text}</Text>

        {this.props.screen === 'Home' ? (
          <View style={styles.actions}>
            <Pressable onPress={this.likear}>
              <Text style={styles.likeText}>
                {this.state.likeado ? '❤️' : '♡'} {likes.length}
              </Text>
            </Pressable>

            <Pressable onPress={this.props.onGoToComments} style={styles.commentButton}>
              <Text style={styles.commentText}>Comentar</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable>
            <Text style={styles.meta}>borrar posteo</Text>
          </Pressable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e9e9e9',
  },
  user: { fontWeight: '700', marginBottom: 4, color: '#0288D1' },
  text: { marginBottom: 6, color: '#333' },
  meta: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row', marginTop: 6, gap: 16 },
  likeText: { fontSize: 12, color: '#0288D1', fontWeight: '600' },

  commentButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E6C200',
  },
  commentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
});

export default Posteos;

