import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function ModalFormCadastro(){
    const router = useRouter();
    const [nome, setNome] = useState("");

    return(
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.text}>NOME:</Text>
                
                <TextInput 
                    value={nome}
                    onChangeText={setNome} 
                    style={styles.input}
                />

                <TouchableOpacity style={styles.buttonConfirmar}>
                    <Text style={styles.textButtonContinuar}>CONFIRMAR</Text>
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
        width: "50%",
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

    input: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "65%",
        paddingHorizontal: 10,
        paddingVertical: 9,
        textAlign: "center",
        
    },

    buttonConfirmar: {
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