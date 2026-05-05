import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../configFireBase/firebaseConfig";

export default function Tasks() {
    
  const { groupId } = useLocalSearchParams();

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        if (!groupId) return;

        // 🔹 pega o grupo
        const groupRef = doc(db, "groups", String(groupId));
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) return;

        const data = groupSnap.data();

        const participantes = data.participantes || [];

        if (participantes.length === 0) {
          setUsers([]);
          return;
        }

        // 🔹 busca usuários
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
            nome: userData.nome,
            cpf: userData.cpf,
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

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => abrirUsuario(item)}
          >
            <Text style={styles.userText}>{item.nome}</Text>
            <Text style={{ textAlign: "center" }}>{item.cpf}</Text>
          </TouchableOpacity>
        )}
      />
        <TouchableOpacity style={styles.taskbutton}>
            <Text style={styles.taskText}>Designar</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#44abe8",
    flex: 1,
    alignItems: "center",
  },

  taskbutton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#00bf63',
    width: 160,
    height: 80,
    borderRadius: 20,
    marginTop: 200,
  },

  taskText: {
    color: "#091d34",
    fontWeight: "bold",
    fontSize: 23,
  },

  userCard: {
    backgroundColor: "#f99d30",
    padding: 15,
    marginTop: 5,
    width: 250,
    borderRadius: 15,
  },

  userText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
    textAlign: "center",
  },
});
