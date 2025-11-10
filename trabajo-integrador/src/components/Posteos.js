import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config';
import firebase from 'firebase/app';
import 'firebase/firestore';

class Posteos extends Component {
  constructor(props) {
    super(props);
    this.state = { likeado: false, likesCount: 0 };
  }

  componentDidMount() {
  let likes = [];
  if (this.props.data && this.props.data.data && this.props.data.data.likes) {
    likes = this.props.data.data.likes; //un data es por props y el otro de snapshot
  }
  this.setState({
    likeado: likes.includes(auth.currentUser.email),
    likesCount: likes.length
  });
}


  likear() {
    const user = auth.currentUser ? auth.currentUser.email : null;
    const postId = this.props.data ? this.props.data.id : null;

  if (!user || !postId) return; 

    if (this.state.likeado) {
      db.collection('posts')
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(user)
        })
        .then(() => this.setState({ likeado: false, likesCount: this.state.likesCount - 1 }));
    } else {
      db.collection('posts')
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(user)
        })
        .then(() => this.setState({ likeado: true, likesCount: this.state.likesCount + 1 }));
    }
  }

  render() {
    let data = this.props.data.data;

    return (
      <View style={styles.card}>
        <Text style={styles.owner}>{data.owner}</Text>
        <Text style={styles.text}>{data.text}</Text>

        <View style={styles.actions}>
          <Pressable style={styles.likeBtn} onPress={() => this.likear()}>
            <Text style={styles.likeText}>
              {this.state.likeado ? '💙 dislike' : '🤍 like'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.commentBtn}
            onPress={() => this.props.onGoToComments(this.props.data.id)}
          >
            <Text style={styles.commentText}> Comentar </Text>
          </Pressable>
        </View>

        <Text style={styles.likesCount}>{this.state.likesCount} likes </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#4FC3F7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FCFF',
  },
  owner: { color: '#0288D1', fontWeight: '700', marginBottom: 4 },
  text: { color: '#333', marginBottom: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  likeBtn: { padding: 6, borderRadius: 6, backgroundColor: '#E1F5FE' },
  likeText: { color: '#0288D1', fontWeight: '600' },
  commentBtn: { padding: 6, borderRadius: 6, backgroundColor: '#B3E5FC' },
  commentText: { color: '#01579B', fontWeight: '600' },
  likesCount: { marginTop: 8, color: '#0288D1', fontWeight: '600' },
});

export default Posteos;



