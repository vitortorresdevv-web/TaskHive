import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home(){
    return(
        <View style={styles.container}>
            <Image style={styles.image} source={require("./imagens/imagemHomeScreen-removebg.png")} />

            <View>
                <Text style={styles.text}>VAMOS ESTUDAR!!!</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonCriar}>
                    <Text style={styles.textButton}>CRIAR PROJETO</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.buttonIngressar}>
                    <Text style={styles.textButton}>INGRESSAR</Text>
                </TouchableOpacity>
            </View>
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
        transform: [{translateY: -150}]
    },

    text: {
        transform: [{translateY: -120}],
        fontWeight: "bold",
        fontSize: 30,
        color: "#ffffff"
    },

    buttonContainer: {
        flexDirection: "row",
        
    },

    buttonCriar: {
        backgroundColor: "#091d34",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
    },

    buttonIngressar: {
        backgroundColor: "#f99d30",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 50,

    },

    textButton: {
        color: "#ffffff",
        fontWeight: "bold",
        padding: 8,
        fontSize: 24
    }
})