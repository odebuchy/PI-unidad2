import React, { Component } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <Pressable
          onPress={() => this.props.navigation.navigate('Login')}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Salir de la app. Hacer click aquí te lleva al login</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: 'stretch', padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  btn: { padding: 12, backgroundColor: '#e5af2fff', borderRadius: 8, alignSelf: 'center' },
  btnText: { textAlign: 'center' },
});

export default Profile;