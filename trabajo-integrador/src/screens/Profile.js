import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { auth, db } from '../firebase/Config';
import Posteos from '../components/Posteos';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { loadingUser: true, loadingPosts: true, username: '', posts: [], error: '' };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loadingUser: false, loadingPosts: false });
        return;
      }

      db.collection('users')
        .where('email', '==', user.email)
        .onSnapshot(
          (docs) => {
            let usernameEncontrado = '';
            docs.forEach(function (doc) {
              let data = doc.data();
              if (data && data.username) {
                usernameEncontrado = data.username;
              }
            });
            this.setState({ username: usernameEncontrado, loadingUser: false });
          },
          (error) => this.setState({ error: error.message, loadingUser: false })
        );

      db.collection('posts')
        .where('owner', '==', user.email)
        .onSnapshot(
          (docs) => {
            let posts = [];
            docs.forEach(function (doc) {
              posts.push({
                id: doc.id,
                data: doc.data()
              });
            });
            this.setState({ posts: posts, loadingPosts: false });
          },
          (error) => this.setState({ error: error.message, loadingPosts: false })
        );
    });
  }

  onGoToComments(postId) {
    if (!postId) return;
    this.props.navigation.navigate('HomeTab', { screen: 'Comments', params: { postId: postId } });
  }

  onLogout() {
    auth.signOut()
      .then(() => { this.props.navigation.navigate('Login'); })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingUser ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <View style={styles.header}>
            <Text style={styles.username}>{this.state.username ? this.state.username : '(sin username)'}</Text>
            <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : ''}</Text>
            <Pressable style={styles.logoutBtn} onPress={() => this.onLogout()}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        )}

        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}

        {this.state.loadingPosts ? (
          <ActivityIndicator style={styles.loaderLarge} />
        ) : this.state.posts.length === 0 ? (
          <Text style={styles.empty}>Todavía no publicaste nada.</Text>
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={(item) => item.id}
            renderItem={(obj) => (
              <Posteos
                data={obj.item}
                onGoToComments={(id) => this.onGoToComments(id)}
              />
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loader: { marginVertical: 16 },
  loaderLarge: { marginTop: 24 },
  header: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 12 },
  username: { fontSize: 20, fontWeight: '700', color: '#0288D1' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  logoutBtn: { marginTop: 12, paddingVertical: 10, alignItems: 'center', borderRadius: 6, backgroundColor: '#0288D1' },
  logoutText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 32, color: '#999' },
  error: { color: 'red', marginTop: 8 }
});

export default Profile;







