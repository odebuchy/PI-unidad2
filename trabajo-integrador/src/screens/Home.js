import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebase/Config';
import Posteos from '../components/Posteos';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: [], loading: true };
  }

  componentDidMount() {
    if (!auth.currentUser) {
      this.props.navigation.navigate('Login');
      return;
    }

    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snap) => {
          const data = snap.docs.map(function (d) { return { id: d.id, data: d.data() }; });
          this.setState({ posts: data, loading: false });
        },
        () => this.setState({ loading: false })
      );
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
          <ActivityIndicator size="large" color="#0288D1" />
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={function (it) { return it.id; }}
            renderItem={(obj) => {
              let item = obj.item;
              return (
                <Posteos
                  data={item}
                  onGoToComments={() =>
                    this.props.navigation.navigate('Comments', { postId: item.id })
                  }
                />
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No hay posts aún.</Text>}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12 },
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
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#0288D1' },
  empty: { color: '#666' },
});

export default Home;



