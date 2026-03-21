import { ModalFormLogin } from '@/components/modal/modalLogin';
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

    export default function index(){

        const router=useRouter();

        return(

            <View style={styles.container}>

                <Image style={styles.image} source={require("./imagens/logo.png")}/>

                <View style={styles.conteudo}>
                    <ModalFormLogin/>
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

    conteudo: {
        alignItems : "center",
        justifyContent : "center",
        marginBottom: 20,
        flex: 1,
    },

    image:{
        marginTop: 140,
        justifyContent: "flex-start",
        width: 200,
        height: 200,
    },

});