import { ModalForm } from '@/components/modal';
import { ModalFormIngressar } from '@/components/modal/modalIngressar';
import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home(){
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleIngressar, setModalVisibleIngressar] = useState(false);

    function AbrirModal(){
        setModalVisible(true)
    }

    function AbrirModalIngressar(){
        setModalVisibleIngressar(true)
    }

    return(
        <View style={styles.container}>
            <Image style={styles.image} source={require("./imagens/imagemHomeScreen-removebg.png")} />

            <View>
                <Text style={styles.text}>VAMOS ESTUDAR!!!</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonCriar]} onPress={AbrirModal}>
                    <Text style={styles.textButton}>CRIAR PROJETO</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.buttonIngressar]} onPress={AbrirModalIngressar}>
                    <Text style={styles.textButton}>INGRESSAR</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} animationType= "fade" transparent={true}>
                <ModalForm fecharModal={() => setModalVisible(false)}/>
            </Modal>
            <Modal visible={modalVisibleIngressar} animationType='fade' transparent={true}>
                <ModalFormIngressar fecharModalIngressar={() => setModalVisibleIngressar(false)}/>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#44abe8",
        alignItems: "center",
        justifyContent: "center"
    },

    image: {
        //transform: [{translateY: -150}]
        marginBottom: 20
    },

    text: {
        //transform: [{translateY: -120}],
        marginBottom: 100,
        fontWeight: "bold",
        fontSize: 30,
        color: "#ffffff"
    },

    buttonContainer: {
        flexDirection: "row",
        marginBottom: 180,
        width: "100%",
        justifyContent: "space-between",
    },

    button: {
        flex: 1,
        alignItems: "center",
    },

    buttonCriar: {
        backgroundColor: "#091d34",
        borderRadius: 20,
        marginRight: 20
    },

    buttonIngressar: {
        backgroundColor: "#f99d30",
        borderRadius: 20,
        marginLeft: 20
    },

    textButton: {
        color: "white",
        fontWeight: "bold",
        padding: 15,
        fontSize: 19.1,
    }
})