import TaskModal from "@/components/modal/taskModal";
import UserTasksModal from "@/components/modal/userTaskModal";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../configFireBase/firebaseConfig";

export default function Tasks() {

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tasksModalVisible, setTasksModalVisible] = useState(false);

  const { groupId } = useLocalSearchParams();

  const [users, setUsers] = useState<any[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        if (!groupId) return;

        const auth = getAuth();
        const currentUser = auth.currentUser;


        const groupRef = doc(db, "groups", String(groupId));
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) return;

        const data = groupSnap.data();

        setIsCreator(currentUser?.uid === data.creatorId);

        const participantes = data.participantes || [];

        if (participantes.length === 0) {
          setUsers([]);
          return;
        }

        const q = query(
          collection(db, "users"),
          where("__name__", "in", participantes)
        );

        const snapshot = await getDocs(q);

        const list: any[] = [];

        snapshot.forEach((doc) => {
          const userData = doc.data();

          list.push({
            id: doc.id,
            nome: userData.nome || "Sem nome",
            cpf: userData.cpf || "Sem CPF",
          });
        });

        setUsers(list);

      } catch (error) {
        console.log("Erro ao carregar participantes:", error);
      }
    }

    loadUsers();
  }, [groupId]);

  function abrirUsuario(user: any) {
    console.log("Selecionado:", user.nome);
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}

        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 40,
        }}

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => {
              setSelectedUser(item);
              setTasksModalVisible(true);
            }}
          >
            <Text style={styles.userText}>{item.nome}</Text>

            <Text style={styles.cpfText}>
              CPF: {item.cpf}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isCreator && (
        <TouchableOpacity style={styles.taskbutton} onPress={() => setModalVisible(true)}>
          <Text style={styles.taskText}>Designar</Text>
        </TouchableOpacity>
      )}

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        users={users}
        groupId={String(groupId)}
      />

      <UserTasksModal
        visible={tasksModalVisible}
        onClose={() => setTasksModalVisible(false)}
        selectedUser={selectedUser}
        groupId={String(groupId)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#44abe8",
    flex: 1,
  },

  taskbutton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00bf63",
    width: 160,
    height: 80,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 30,
  },

  taskText: {
    color: "#091d34",
    fontWeight: "bold",
    fontSize: 23,
  },

  userCard: {
    backgroundColor: "#f99d30",
    padding: 15,
    marginTop: 10,
    width: 280,
    borderRadius: 15,
  },

  userText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
    textAlign: "center",
  },

  cpfText: {
    textAlign: "center",
    marginTop: 5,
    color: "#333",
  },
});