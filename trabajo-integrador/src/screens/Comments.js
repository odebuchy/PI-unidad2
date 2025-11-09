import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../firebase/Config';
import firebase from 'firebase';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, text: '', comments: [], error: '' };
    this.unsub = null;
  }

  componentDidMount() {
    const postId = this.props.route.params?.postId;
    if (!postId) return this.setState({ error: 'Falta postId', loading: false });

    this.unsub = db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (snap) => {
          const comments = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
          this.setState({ comments, loading: false });
        },
        (e) => this.setState({ error: e.message, loading: false })
      );
  }

  componentWillUnmount() {
    if (this.unsub) this.unsub();
  }

  onAddComment = () => {
    const postId = this.props.route.params?.postId;
    const user = auth.currentUser;
    const text = (this.state.text || '').trim();
    if (!user || !postId || !text) return;

    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .add({
        text,
        ownerUid: user.uid,
        ownerEmail: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => this.setState({ text: '' }))
      .catch((e) => this.setState({ error: e.message }));
  };

  render() {
    const { loading, comments, text, error } = this.state;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : comments.length === 0 ? (
            <Text style={styles.empty}>Todavía no hay comentarios. ¡Sé el primero!</Text>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              {comments.map((c) => (
                <View key={c.id} style={styles.commentCard}>
                  <Text style={styles.commentOwner}>{c.data.ownerEmail || 'usuario'}</Text>
                  <Text style={styles.commentText}>{c.data.text}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Escribí un comentario..."
              value={text}
              onChangeText={(t) => this.setState({ text: t })}
              style={styles.input}
              multiline
            />
            <Pressable style={styles.sendBtn} onPress={this.onAddComment}>
              <Text style={styles.sendText}>Enviar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  empty: { textAlign: 'center', color: '#999', marginVertical: 16 },
  error: { color: 'red', marginTop: 8 },
  commentCard: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentOwner: { fontWeight: '700', color: '#4FC3F7' },
  commentText: { marginTop: 2, color: '#222' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  input: { flex: 1, minHeight: 40, maxHeight: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  sendBtn: { backgroundColor: '#4FC3F7', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginLeft: 8 },
  sendText: { color: '#fff', fontWeight: '700' },
});

export default Comments;