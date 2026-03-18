import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

    const router=useRouter();

    export default function index(){
        return(
            <View style={styles.container}>
                <Image style={styles.image} source={require("./imagens/logo.png")}/>
                <TouchableOpacity style={styles.button} onPress={() => router.push("./home")}>
                    <Text style={styles.buttonText}>CONFIRMAR</Text>

                </TouchableOpacity>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#7dc0d6",
        alignItems : "center",
        justifyContent : "center",
        flex:1
    },

    image:{
        transform: [{translateY: -140}],
        width: 200,
        height: 200,
    },

    button:{
        backgroundColor: "#ffffff",
        width: 180,
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        transform: [{translateY: 160}]
    },

    buttonText:{
        color:"#000000",
        fontWeight:"bold",
        fontSize: 26,

    },

});