import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../../app/(tabs)/src/configFireBase/firebaseConfig";

type Props = {
  visible: boolean;
  onClose: () => void;
  users: any[];
  groupId: string;
};

export default function TaskModal({
  visible,
  onClose,
  users,
  groupId,
}: Props) {

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [titulo, setTitulo] = useState("");

  const [descricao, setDescricao] = useState("");

    async function handleDesignarTarefa() {

  if (!selectedUser) {
    alert("Selecione um usuário");
    return;
  }

  if (!titulo || !descricao) {
    alert("Preencha todos os campos");
    return;
  }

  try {

    await addDoc(collection(db, "tasks"), {
      titulo,
      descricao,

      userId: selectedUser.id,
      userName: selectedUser.nome,

      groupId,

      completed: false,

      createdAt: new Date(),
    });

    alert("Tarefa criada!");

    setTitulo("");
    setDescricao("");
    setSelectedUser(null);

    onClose();

  } catch (error: any) {

  alert(error.message);
}
}

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      <View style={styles.container}>

        <Text style={styles.title}>
          Designar Tarefa
        </Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}

          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userCard,
                selectedUser?.id === item.id &&
                styles.selectedCard
              ]}
              onPress={() => setSelectedUser(item)}
            >
              <Text style={styles.userText}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TextInput
          placeholder="Nome da tarefa"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          style={styles.descriptionInput}
        />

        <TouchableOpacity style={styles.button}onPress={handleDesignarTarefa}>
          <Text style={styles.buttonText}>
            DESIGNAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton}onPress={onClose}>
          <Text style={styles.closeText}>
            Fechar
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#44abe8",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#091d34",
    marginBottom: 20,
    textAlign: "center",
  },

  userCard: {
    backgroundColor: "#f99d30",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  selectedCard: {
    borderWidth: 3,
    borderColor: "#091d34",
  },

  userText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#091d34",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },

  descriptionInput: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#00bf63",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#091d34",
  },

  closeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#091d34",
  },

  closeButton: {
    backgroundColor: "#cc0000",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
  },
});