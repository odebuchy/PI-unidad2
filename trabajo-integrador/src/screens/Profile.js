// src/screens/Profile.js
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { auth, db } from '../firebase/Config';
import Posteos from '../components/Posteos';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingUser: true,
      loadingPosts: true,
      email: '',
      username: '',
      posts: [],
      error: ''
    };
    this.postsUnsub = null; // para cortar el listener al salir
  }

  componentDidMount() {
    const user = auth.currentUser;
    if (!user) {
      this.props.navigation.replace('Login');
      return;
    }

    const email = user.email;
    this.setState({ email });

    // 1) Traer username por email (en 'users' guardás 'email')
    db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()
      .then((qs) => {
        let username = '';
        qs.forEach((doc) => {
          const data = doc.data() || {};
          username = data.username || '';
        });
        this.setState({ username, loadingUser: false });
      })
      .catch((e) => this.setState({ error: e.message, loadingUser: false }));

    // 2) Posts del usuario en tiempo real (sin orderBy → no requiere índice)
    this.postsUnsub = db
      .collection('posts')
      .where('owner', '==', email)
      .onSnapshot(
        (snap) => {
          const posts = snap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
          // Orden local por createdAt (más nuevo primero)
          posts.sort((a, b) => {
            const av = a.data.createdAt?.toMillis ? a.data.createdAt.toMillis() : a.data.createdAt || 0;
            const bv = b.data.createdAt?.toMillis ? b.data.createdAt.toMillis() : b.data.createdAt || 0;
            return bv - av;
          });
          this.setState({ posts, loadingPosts: false });
        },
        (e) => this.setState({ error: e.message, loadingPosts: false })
      );
  }

  componentWillUnmount() {
    if (this.postsUnsub) this.postsUnsub();
  }

  onLogout = () => {
    auth
      .signOut()
      .then(() => this.props.navigation.replace('Login'))
      .catch((e) => this.setState({ error: e.message }));
  };

  render() {
    const { loadingUser, loadingPosts, username, email, posts, error } = this.state;

    return (
      <View style={styles.container}>
        {loadingUser ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : (
          <View style={styles.header}>
            <Text style={styles.username}>{username || '(sin username)'}</Text>
            <Text style={styles.email}>{email}</Text>
            <Pressable style={styles.logoutBtn} onPress={this.onLogout}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}

        {loadingPosts ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : posts.length === 0 ? (
          <Text style={styles.empty}>Todavía no publicaste nada.</Text>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
            {posts.map((p) => (
              <Posteos key={p.id} data={p} navigation={this.props.navigation} />
            ))}
          </ScrollView>
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
  error: { color: 'red', marginTop: 8 },
});

export default Profile;