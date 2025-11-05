import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { db, auth } from '../firebase/Config';

class Posteo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            likeado: false

        }
    }
    componentDidMount() {


        console.log(this.props)

        if (this.props.data.data.likes.includes(auth.currentUser.email)) {
            this.setState({ likeado: true })

        } else {
            this.setState({ likeado: false })
        }

    }

    likear() {
        if (this.state.likeado) {
            db.collection("posts").doc(this.props.data.id).update({ likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) })
                .then(() => {
                    this.setState({ likeado: false })
                })
        } else {
            db.collection("posts").doc(this.props.data.id).update({ likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) })
                .then(() => {
                    this.setState({ likeado: true })
                })

        }
    }

    render() {
        return (
            <View style={styles.card}>
                <Text style={styles.user}>{this.props.data.data.owner}</Text>
                <Text style={styles.text}>{this.props.data.data.text}</Text>
                {this.props.screen == "Home" ?
                    <View>
                        <Pressable onPress={() => this.likear()}>
                            <Text style={styles.meta}>{this.state.likeado ? "❤️" : "♡"} {this.props.data.data.likes.length}</Text>
                        </Pressable>
                        <Pressable>
                            <Text style={styles.meta}>ir a comentar</Text>
                        </Pressable>
                    </View> :
                    <Pressable>
                        <Text style={styles.meta}>borrar posteo</Text>
                    </Pressable>
                }


            </View>

        )
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

export default Posteo