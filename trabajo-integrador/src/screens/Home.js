// src/screens/Home.js
import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config';


class Home extends Component {
  state = { posts: [], loading: true };

  componentDidMount() {
     if (!auth.currentUser) {
       this.props.navigation.replace('Login');
       return;
     }
     db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(snap => {
       const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
       this.setState({ posts: data, loading: false });
    });
    this.setState({ loading: false }); 
  }

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.user}>{item.userEmail ?? '(usuario)'}</Text>
      <Text style={styles.text}>{item.text ?? '(sin contenido)'}</Text>
      <Text style={styles.meta}>❤️ {Array.isArray(item.likes) ? item.likes.length : 0}</Text>
    </View>
  );

  render() {
    const { posts, loading } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Listado de posteos</Text>
        {loading ? (
          <Text>Cargando…</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(it) => it.id}
            renderItem={this.renderItem}
            ListEmptyComponent={<Text>No hay posts aún.</Text>}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  card: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  user: { fontWeight: '600', marginBottom: 4 },
  text: { marginBottom: 6 },
  meta: { fontSize: 12, color: '#666' },
});

export default Home;
