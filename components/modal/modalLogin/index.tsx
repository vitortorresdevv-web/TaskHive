import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function ModalFormLogin(){
    const router = useRouter();
    const [cpf, setcpf] = useState("");
    const [senha, setSenha] = useState("");

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

                <TouchableOpacity style={styles.buttonContinuar}onPress={() => router.push("../../src/pages/home")}>
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
})