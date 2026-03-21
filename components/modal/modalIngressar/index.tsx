import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function ModalFormIngressar(){
    const router = useRouter();
    const [texto, setTexto] = useState("");
    const [senha, setSenha] = useState("");
    const [particip,setParticip] = useState("");

    return(
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.text}>NOME DO TRABALHO</Text>
                
                <TextInput 
                    value={texto}
                    onChangeText={setTexto} 
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
    }
})