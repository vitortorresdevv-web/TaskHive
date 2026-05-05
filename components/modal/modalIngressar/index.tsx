import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { arrayUnion } from 'firebase/firestore';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { db } from "../../../app/(tabs)/src/configFireBase/firebaseConfig";


export function ModalFormIngressar({fecharModalIngressar}: {fecharModalIngressar: () => void} ){
    const router = useRouter();
    const [codigo, setCodigo] = useState("");
    const [senha, setSenha] = useState("");

    async function ingressar(){
        if (!codigo || !senha) return;

        try{
            const auth = getAuth();
            const user = auth.currentUser;
            
            if(!user) return;

            const q = query(
                collection(db, 'groups'), where('codigo', '==', codigo)
            );

            const snapshot = await getDocs(q);

            if(snapshot.empty){
                alert('Codigo inválido!');
                return;
            }

            const grupoDoc = snapshot.docs[0];
            const grupoData = grupoDoc.data();

            if(grupoData.senha !== senha){
                alert('Senha incorreta!');
                return;
            }

            await updateDoc(doc(db, 'groups', grupoDoc.id), {
                participantes: arrayUnion(user.uid)
            });

            alert('Você se juntou ao grupo 🔥')

            fecharModalIngressar();
        } catch (error) {
            console.log(error);
        }
}

    return(
            <View style={styles.container}>
                <View style={styles.conteudo}>

                    <TouchableOpacity style={styles.buttonFecharModal} onPress={fecharModalIngressar}>
                        <Image style={styles.image} source={require("../imagensModal/sair-da-tela-cheia.png")}/>
                    </TouchableOpacity>

                    <Text style={styles.text}>CÓDIGO DE ACESSO</Text>
                    
                    <TextInput 
                        value={codigo}
                        onChangeText={setCodigo} 
                        style={styles.input}
                    />

                    <Text style={[styles.text, styles.textAbaixo]}>SENHA</Text>
                    
                    <TextInput 
                        value={senha}
                        onChangeText={setSenha} 
                        style={styles.input}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity style={styles.buttonContinuar}>
                        <Text style={styles.textButtonContinuar}>CONTINUAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(24, 24, 24, 0.6)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        
    },

    conteudo: {
        backgroundColor: "#091d34",
        width: "85%",
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
    },
    
    input: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "65%",
        paddingHorizontal: 10,
        paddingVertical: 9,
        textAlign: "center",
        
    },
    
    inputNum: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "65%",
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

    buttonFecharModal: {
        marginLeft: "80%",
    },

    image: {
        height: 35,
        width: 35,
    },
})