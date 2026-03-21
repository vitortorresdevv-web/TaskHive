import { ModalFormLogin } from '@/components/modal/modalLogin';
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

    const router=useRouter();

    export default function index(){

        return(

            <View style={styles.container}>

                <Image style={styles.image} source={require("./imagens/logo.png")}/>

            <View style={styles.container}>
                <ModalFormLogin></ModalFormLogin>
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
        transform: [{translateY: 50}],
        width: 200,
        height: 200,
    },

});