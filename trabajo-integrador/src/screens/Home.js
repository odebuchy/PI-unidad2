import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebase/Config';
import Posteos from '../components/Posteos';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: [], loading: true, error: '' };
  }

  componentDidMount() {
    if (!auth.currentUser) {
      this.props.navigation.navigate('Login');
      return;
    }

    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (docs) => {
          let posts = [];
          docs.forEach(function (doc) {
            posts.push({
              id: doc.id,
              data: doc.data()
            });
          });
          this.setState({
            posts: posts,
            loading: false
          });
        },
        () => this.setState({ loading: false, error: 'No se pudieron cargar los posts.' })
      );
  }

  onGoToComments(postId) {
    if (!postId) return;
    this.props.navigation.navigate('Comments', { postId: postId });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Sesh</Text>
        </View>

        <Text style={styles.label}>Listado de posteos</Text>

        {this.state.loading ? (
          <ActivityIndicator size="large" color="#0288D1" style={styles.loader} />
        ) : this.state.posts.length === 0 ? (
          <Text style={styles.empty}>No hay posts aún.</Text>
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

        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4FC3F7', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#0288D1' },
  logo: { width: 28, height: 28, marginRight: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#0288D1' },
  loader: { marginTop: 8 },
  empty: { color: '#666' },
  error: { color: '#D32F2F', marginTop: 8 }
});

export default Home;




