import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

  export default function Index(){

    const router = useRouter();

    return(
      <View style={styles.container}>
        <Image style={styles.image} source={require("../../assets/images/logo.png")}/>
          <TouchableOpacity style={styles.button} onPress={() => router.push("./src/pages/login")}>
            <Text style={styles.buttonText}>ENTRAR</Text>
          </TouchableOpacity>
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "lightblue",
      alignItems: "center",
      justifyContent: "center",
      flex: 1
    },

    image: {
      transform: [{translateY: -40}]
    },

    button:{
      backgroundColor: "#f99d30",
      width: "40%",
      borderRadius: 8,
      height: 40,
      justifyContent: "center",
      alignItems: "center"
    },
    
    buttonText:{
      color: "#091d34",
      fontSize: 23,
      fontWeight: "bold"
    }
  });