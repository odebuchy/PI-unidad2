import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { auth, db } from '../firebase/Config';
import Posteos from '../components/Posteos';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingUser: true,
      loadingPosts: true,
      username: '',
      posts: [],
      error: ''
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loadingUser: false, loadingPosts: false });
        return;
      }

      db.collection('users')
        .where('email', '==', user.email)
        .get()
        .then((snapshot) => {
          let usernameEncontrado = '';
          snapshot.forEach(function (doc) {
            let data = doc.data();
            if (data.username) {
              usernameEncontrado = data.username;
            }
          });
          this.setState({ username: usernameEncontrado, loadingUser: false });
        })
        .catch((error) => this.setState({ error: error.message, loadingUser: false }));

      db.collection('posts')
        .where('owner', '==', user.email)
        .onSnapshot(
          (snapshot) => {
            let arrayPosts = snapshot.docs.map(function (doc) {
              return { id: doc.id, data: doc.data() };
            });
            this.setState({ posts: arrayPosts, loadingPosts: false });
          },
          (error) => this.setState({ error: error.message, loadingPosts: false })
        );
    });
  }

  onLogout() {
    auth.signOut()
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => this.setState({ error: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingUser ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : (
          <View style={styles.header}>
            <Text style={styles.username}>
              {this.state.username ? this.state.username : '(sin username)'}
            </Text>
            <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : ''}</Text>
            <Pressable style={styles.logoutBtn} onPress={() => this.onLogout()}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        )}

        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}

        {this.state.loadingPosts ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : this.state.posts.length === 0 ? (
          <Text style={styles.empty}>Todavía no publicaste nada.</Text>
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={function (item) { return item.id; }}
            renderItem={(obj) => {
              let item = obj.item;
              return (
                <Posteos
                  data={item}
                  onGoToComments={() =>
                    this.props.navigation.navigate('HomeTab', {
                      screen: 'Comments',
                      params: { postId: item.id }
                    })
                  }
                />
              );
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 12 },
  username: { fontSize: 20, fontWeight: '700', color: '#0288D1' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  logoutBtn: { marginTop: 12, paddingVertical: 10, alignItems: 'center', borderRadius: 6, backgroundColor: '#0288D1' },
  logoutText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 32, color: '#999' },
  error: { color: 'red', marginTop: 8 }
});

export default Profile;






