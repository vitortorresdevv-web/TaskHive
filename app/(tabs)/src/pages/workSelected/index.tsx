import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from 'expo-router';
import { useState } from "react";

import { useRef } from "react";
import { Animated } from "react-native";

export default function workSelected(){


  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  function abrirMenu() {
  setMenuAberto(true);

  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();
}

  function fecharMenu() {
  Animated.timing(slideAnim, {
    toValue: 300,
    duration: 300,
    useNativeDriver: true,
  }).start(() => setMenuAberto(false));
}

  return(
    <View style={{ flex: 1 }}>

      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/src/pages/home/home')}>
            <Image style={styles.image} source={require('./imagens/seta-esquerda.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={abrirMenu}>
            <Image style={styles.image} source={require('./imagens/menu-aberto.png')} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titleText}>Nome do Trabalho</Text>
        <Text style={styles.text}>Progresso do Trabalho</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.buttonText}>Tarefas</Text>
        </TouchableOpacity>

      </View>

      {/* DRAWER */}
      {menuAberto && (
        <View style={styles.overlay}>
          
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >

            <TouchableOpacity onPress={fecharMenu}>
              <Text style={styles.fechar}>✖</Text>
            </TouchableOpacity>

            <TouchableOpacity><Text style={styles.item}>Chat</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.item}>Integrantes</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.item}>Código Acesso</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.item}>Convidar</Text></TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.item, styles.sair]}>
                Sair do trabalho
              </Text>
            </TouchableOpacity>

          </Animated.View>

        </View>
      )}

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
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
    },

    drawer: {
      position: "absolute",
      right: 0,
      top: 0,
      width: '60%',
      height: "100%",
      backgroundColor: "rgba(19, 46, 72, 0.75)",
      padding: 20,
    },

    item: {
      color: "#132e48",
      fontSize: 23,
      marginTop: 20,
      marginBottom: 35,
      backgroundColor: '#f99d30',
      borderRadius: 20,
      justifyContent: 'center',
      padding: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },

    sair: {
      backgroundColor: '#cc0000',
      color: 'white',
    },

    fechar: {
      top: 10,
      marginBottom: 36,
      color: "white",
      fontSize: 22,
      fontWeight: 'bold',
    },
})
