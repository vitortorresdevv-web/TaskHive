import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from 'expo-router';

export default function workSelected(){

  const router = useRouter()

  return(
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/src/pages/home/home')}>
          <Image style={styles.image} source={require('./imagens/seta-esquerda.png')}></Image>
        </TouchableOpacity>

        <TouchableOpacity>
          <Image style={styles.image} source={require('./imagens/menu-aberto.png')}></Image>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.titleText}>Nome do Trabalho</Text>
      </View>

      <View>
        <Text style={styles.text}>Progresso do Trabalho</Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.buttonText}>Tarefas</Text>
      </TouchableOpacity>
    </View>
  ) 
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#44abe8',
    },

    btn: {
      backgroundColor: '#f99d30',
      borderRadius: 20,
      width: '90%',
      marginTop: 50,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center'
      
    },
    
    buttonText:{
      color: "#091d34",
      fontSize: 23,
      fontWeight: "bold"
    },

    titleText: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 60,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 50,
    },
    
    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50,
    },

    image: {
      width: 35,
      height: 35,
    },
})