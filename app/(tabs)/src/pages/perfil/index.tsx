import { ModalEstatiscaPerfil } from "@/components/modal/modalPerfil";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../configFireBase/firebaseConfig";

export default function Perfil(){
    const [dados, setDados] = useState<any>(null);
    const[foto,setFoto] = useState<string | null>(null);

    useEffect(() =>{
        async function buscarDados(){
            const user = auth.currentUser;

            if (!user){
                console.log('Não logado!');
                return;
            }

            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                setDados(docSnap.data());
            } else {
                console.log('Usuário não encontrado');
            }
        }

        buscarDados();
    }, []);

        async function selecionarImage(){
            const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            quality: 1,});

            if (!result.canceled){
                setFoto(result.assets[0].uri);
            }
        }
    
return(
  <View style={styles.container}>

    <View style={styles.header}>
      <TouchableOpacity>
        <Image style={styles.engrenagem} source={require('./imagens/engrenagem.png')}/>
      </TouchableOpacity>
    </View>


    <View style={styles.fotoContainer}>
      <Image 
        style={styles.fotoAvatar} 
        source={foto ? {uri: foto} : require('../../../../../assets/images/avatarPadrao.png')}
      />

      <TouchableOpacity style={styles.buttonMudarFotoPerfil} onPress={selecionarImage}>
        <Text style={styles.textButton}>➕ Mudar foto</Text>
      </TouchableOpacity>
    </View>


    <View style={styles.dadosContainer}>
      <Text style={styles.nome}>{dados?.nome}</Text>
      <Text style={styles.cpf}>CPF: {dados?.cpf}</Text>
    </View>


    <ModalEstatiscaPerfil/>

  </View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#44abe8',
        alignItems: 'center',
    },

    engrenagem: {
        height: 35,
        width: 35,
    },

    header: {
        width: "100%",
        alignItems: "flex-end",
        padding: 20,
        paddingTop: 35,
    },

    fotoContainer: {
        alignItems: "center",
    },

    fotoAvatar: {
    width: 200,
    height: 200,
    borderRadius: 80,
    },

    buttonMudarFotoPerfil: {
    marginTop: 10,
    backgroundColor: "#f99d30",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    },

    dadosContainer: {
    marginTop: 25,
    alignItems: "center",
    paddingBottom: 60,
    },

    textButton: {
        color: "white",
        fontWeight: "bold",
        padding: 8,
        fontSize: 19.1,
    },

    nome: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    },

    cpf: {
        fontSize: 18,
        color: "white",
        marginTop: 5,
    },
})