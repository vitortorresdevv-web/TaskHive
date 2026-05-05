import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../app/(tabs)/src/configFireBase/firebaseConfig';

export function ModalForm({ fecharModal }: { fecharModal: () => void }) {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [senha, setSenha] = useState("");
  const [particip, setParticip] = useState("");

  function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

  async function handleCreateGroup() {
    if (!texto || !senha || !particip) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log("Usuário não está logado");
        return;
      }

      console.log("USER:", user);

      const codigo = gerarCodigo();

      await addDoc(collection(db, "groups"), {
        nome: texto,
        senha: senha,
        numParticipantes: particip,
        participantes: [user.uid],
        creatorId: user.uid,
        codigo: codigo,
        createdAt: new Date(),
      });

      setTexto("");
      setSenha("");
      setParticip("");

      fecharModal();
    } catch (error) {
      console.log("Erro ao criar grupo:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>

        <TouchableOpacity style={styles.buttonFecharModal} onPress={fecharModal}>
          <Image
            style={styles.image}
            source={require("./imagensModal/sair-da-tela-cheia.png")}
          />
        </TouchableOpacity>

        <Text style={styles.text}>NOME DO TRABALHO</Text>

        <TextInput
          value={texto}
          onChangeText={setTexto}
          style={styles.input}
          placeholder="Digite o nome"
          placeholderTextColor="#999"
        />

        <Text style={[styles.text, styles.textAbaixo]}>SENHA</Text>

        <TextInput
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
          placeholder="Digite a senha"
          placeholderTextColor="#999"
        />

        <Text style={[styles.text, styles.textAbaixo]}>
          NUMERO DE PARTICIPANTES
        </Text>

        <TextInput
          value={particip}
          onChangeText={setParticip}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 5"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.buttonContinuar} onPress={handleCreateGroup}>
          <Text style={styles.textButtonContinuar}>CONTINUAR</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
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
    width: "85%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  text: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    fontSize: 14,
  },

  textAbaixo: {
    marginTop: 30,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: "center",
  },

  buttonContinuar: {
    marginTop: 30,
    backgroundColor: "#f99d30",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },

  textButtonContinuar: {
    color: "#091d34",
    fontWeight: "bold",
    fontSize: 18,
  },

  buttonFecharModal: {
    alignSelf: "flex-end",
  },

  image: {
    height: 30,
    width: 30,
  },
});