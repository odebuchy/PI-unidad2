import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { db, auth } from '../firebase/Config';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { loadingPost: true, loadingComments: true, post: null, comments: [], text: '', error: '' };
  }

  componentDidMount() {
    let postId = this.props.route.params.postId;
    if (!postId) return;

    db.collection('posts').doc(postId).get().then(doc => {
      this.setState({ post: { id: doc.id, data: doc.data() }, loadingPost: false });
    }).catch(() => this.setState({ loadingPost: false }));

    db.collection('comments').where('postId', '==', postId).onSnapshot(
      (snap) => {
        let data = snap.docs.map(function (d) { return { id: d.id, data: d.data() }; });
        this.setState({ comments: data, loadingComments: false });
      },
      () => this.setState({ loadingComments: false })
    );
  }

  onSubmit() {
    let postId = this.props.route.params.postId;
    if (!auth.currentUser || !postId || !this.state.text) return;

    db.collection('comments').add({
      postId: postId,
      owner: auth.currentUser.email,
      text: this.state.text,
      createdAt: Date.now(),
    }).then(() => this.setState({ text: '' }));
  }

  renderHeader() {
    let p = this.state.post ? this.state.post.data : {};
    return (
      <View style={styles.postCard}>
        <Text style={styles.owner}>{p.owner}</Text>
        <Text style={styles.text}>{p.text}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingPost ? <ActivityIndicator style={{ marginVertical: 12 }} /> : this.renderHeader()}
        {this.state.loadingComments ? (
          <ActivityIndicator style={{ marginVertical: 12 }} />
        ) : (
          <FlatList
            data={this.state.comments}
            keyExtractor={function (it) { return it.id; }}
            renderItem={function (obj) {
              let item = obj.item;
              return (
                <View style={styles.commentCard}>
                  <Text style={styles.commentOwner}>{item.data.owner}</Text>
                  <Text style={styles.commentText}>{item.data.text}</Text>
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>Sé el primero en comentar.</Text>}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un comentario..."
            value={this.state.text}
            onChangeText={(t) => this.setState({ text: t })}
          />
          <Pressable style={styles.sendBtn} onPress={() => this.onSubmit()}>
            <Text style={styles.sendText}>Publicar</Text>
          </Pressable>
        </View>
        {!!this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  postCard: { borderWidth: 1, borderColor: '#4FC3F7', borderRadius: 8, padding: 12, backgroundColor: '#F9FCFF', marginBottom: 12 },
  owner: { color: '#0288D1', fontWeight: '700', marginBottom: 6 },
  text: { color: '#333' },
  commentCard: { borderWidth: 1, borderColor: '#E3F2FD', borderRadius: 8, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
  commentOwner: { color: '#0288D1', fontWeight: '700' },
  commentText: { color: '#333', marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#4FC3F7', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#F9FCFF' },
  sendBtn: { marginLeft: 8, backgroundColor: '#4FC3F7', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: '#0288D1', alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginVertical: 8 },
  error: { color: '#D32F2F', marginTop: 6 },
});

export default Comments;


