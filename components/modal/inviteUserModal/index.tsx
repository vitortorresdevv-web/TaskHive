import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../../app/(tabs)/src/configFireBase/firebaseConfig";

type Props = {
  visible: boolean;
  onClose: () => void;

  groupId: string;
  groupName: string;
};

export default function InviteUserModal({
  visible,
  onClose,
  groupId,
  groupName,
}: Props) {

  const auth = getAuth();

  const currentUser = auth.currentUser;

  const [cpf, setCpf] = useState("");

  async function enviarConvite() {

  try {

    if (!cpf) {
      alert("Digite um CPF");
      return;
    }

    const q = query(
      collection(db, "users"),
      where("cpf", "==", cpf)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Usuário não encontrado");
      return;
    }

    const userDoc = snapshot.docs[0];

    const userData = userDoc.data();

    const groupRef = doc(db, "groups", groupId);

        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
        alert("Grupo não encontrado");
        return;
        }

        const groupData = groupSnap.data();

        const participantes = groupData.participantes || [];

        if (participantes.includes(userDoc.id)) {
        alert("Usuário já participa do grupo");
        return;
        }

        const inviteQuery = query(
            collection(db, "invites"),
            where("groupId", "==", groupId),
            where("toUserId", "==", userDoc.id),
            where("status", "==", "pendente")
        );

const inviteSnapshot = await getDocs(inviteQuery);

if (!inviteSnapshot.empty) {
  alert("Usuário já possui convite pendente");
  return;
}

    const currentUserDoc = await getDoc(
      doc(db, "users", currentUser!.uid)
    );

    const currentUserData = currentUserDoc.data();

    await addDoc(collection(db, "invites"), {

      groupId,
      groupName,

      fromUserId: currentUser?.uid,

      fromUserName:
        currentUserData?.nome || "Usuário",

      toUserId: userDoc.id,

      status: "pendente",

      createdAt: new Date(),
    });

    alert("Convite enviado!");

    setCpf("");

    onClose();

  } catch (error) {

    console.log(error);

    alert("Erro ao enviar convite");
  }
}

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>
            Convidar Usuário
          </Text>

          <TextInput
            placeholder="Digite o CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={enviarConvite}
          >
            <Text style={styles.buttonText}>
              Enviar Convite
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
          >
            <Text style={styles.closeText}>
              Fechar
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    backgroundColor: "#44abe8",
    borderRadius: 25,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#091d34",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    textAlign:"center",
  },

  button: {
    backgroundColor: "#00bf63",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
  },

  closeText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
  },

});