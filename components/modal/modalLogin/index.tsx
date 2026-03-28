import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../app/(tabs)/src/configFireBase/firebaseConfig';
import { ModalFormCadastro } from '../modalCadastro';

export function ModalFormLogin(){
    const router = useRouter();

    const[modalVisible, setModalVisible] = useState(false);

    const [cpf, setcpf] = useState("");
    const [senha, setSenha] = useState("");

    async function cadastrar() {
        try{
            const cpfLimpo = cpf.replace(/\D/g, "");
            const emailFake = cpfLimpo + '@taskhive.com'

            // cria o nosso usuario no firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailFake,
                senha
            );

            const user = userCredential.user;

            setModalVisible(false);

            //salva o usuario no firestore
            await setDoc(doc(db, 'users', user.uid), {
                cpf: cpfLimpo,
                createAt: new Date(),
            });

            console.log('usuario cadastrado');
            router.push('../../src/pages/home')
        } catch(error: any){
            if (error.code === "auth/email-already-in-use"){
                console.log('CPF ja cadastrado!!')
            } else{
                console.log("erro", error)
            }
        }
}

    return(
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.text}>CPF:</Text>
                
                <TextInput 
                    placeholder='XXX.XXX.XXX-YY'
                    value={cpf}
                    onChangeText={setcpf} 
                    style={styles.input}
                />

                <Text style={[styles.text, styles.textAbaixo]}>SENHA:</Text>
                
                <TextInput 
                    placeholder='********'
                    value={senha}
                    onChangeText={setSenha} 
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Modal visible={modalVisible} animationType="fade" transparent >
                <ModalFormCadastro/>
                </Modal>

                <TouchableOpacity style={styles.buttonContinuar} onPress={cadastrar}>
                    <Text style={styles.textButtonContinuar}>CONFIRMAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        
    },

    conteudo: {
        backgroundColor: "#091d34",
        width: 280,
        maxWidth: 280,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "flex-start",
    },

    text: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 30,
    },

    textAbaixo: {
        marginTop: 50,
        fontWeight: "bold",
    },
    
    input: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 180,
        fontWeight: "bold",
        paddingVertical: 9,
        textAlign: "center",
        
    },
    
    inputNum: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 50,
        paddingHorizontal: 10,
    },

    buttonContinuar: {
        marginTop: 30,
        backgroundColor: "#f99d30",
        borderRadius: 10
    },
    
    textButtonContinuar: {
        color: "#091d34",
        fontWeight: "bold",
        fontSize: 19.1,
        padding: 6,
    },
    //only to commit
})