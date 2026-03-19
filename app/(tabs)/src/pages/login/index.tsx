import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

    const router=useRouter();

    export default function index(){
        const [cpf, setcpf] = useState<string>("");
        const [senha, setsenha] = useState<string>("");

        return(
            <View style={styles.container}>
                <Image style={styles.image} source={require("./imagens/logo.png")}/>
                <TouchableOpacity style={styles.button} onPress={() => router.push("./home")}>
                    <Text style={styles.buttonText}>CONFIRMAR</Text>

                </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF:</Text>
                <TextInput
                style={styles.input}
                placeholder="XXX.XXX.XXX-YY"
                value = {cpf}
                onChangeText={setcpf}
                />
                </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>SENHA:</Text>
                <TextInput
                style={styles.input}
                placeholder="********"
                value = {senha}
                onChangeText={setsenha}
                secureTextEntry
                />
                </View>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#7dc0d6",
        alignItems : "center",
        justifyContent : "center",
        flex:1,
    },

    image:{
        transform: [{translateY: -140}],
        width: 200,
        height: 200,
    },

    button:{
        backgroundColor: "#ffffff",
        width: 210,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        transform: [{translateY: 290}]
    },

    buttonText:{
        color:"#000000",
        fontWeight:"bold",
        fontSize: 26,

    },
    
    input: {
        height: 50,
        width: 210,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 5,
        borderColor: "#ffffff",
        textAlign: "center",
        fontWeight: "bold",
        borderRadius: 8,
        backgroundColor: "#ffffff",
        transform: [{translateY:-120}],
        
    },

    inputGroup: {
        marginBottom: 1,
    },

    label: {
        fontSize: 26,
        marginBottom: "5%",
        color: "#ffffff",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
  },

});