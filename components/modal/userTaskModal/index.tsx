import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "../../../app/(tabs)/src/configFireBase/firebaseConfig";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedUser: any;
  groupId: string;
};

export default function UserTasksModal({
  visible,
  onClose,
  selectedUser,
  groupId,
}: Props) {

  const auth = getAuth();

  const currentUser = auth.currentUser;

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {

  if (!selectedUser) return;

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", selectedUser.id),
    where("groupId", "==", groupId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {

    const list: any[] = [];

    snapshot.forEach((docItem) => {

      const data = docItem.data();

      list.push({
        id: docItem.id,
        ...data,
      });
    });

    setTasks(list);

  });

  return () => unsubscribe();

}, [selectedUser]);

  async function toggleTask(task: any) {

    if (currentUser?.uid !== task.userId) {
      return;
    }

    try {

      const taskRef = doc(db, "tasks", task.id);

      await updateDoc(taskRef, {
        completed: !task.completed,
      });

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >

      <View style={styles.container}>

        <Text style={styles.title}>
          Tarefas de {selectedUser?.nome}
        </Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}

          renderItem={({ item }) => {

            const isOwner =
              currentUser?.uid === item.userId;

            return (

              <View style={styles.taskCard}>

                <Text style={styles.taskTitle}>
                  {item.titulo}
                </Text>

                <Text style={styles.taskDescription}>
                  {item.descricao}
                </Text>

                <TouchableOpacity
                  disabled={!isOwner}
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxDone,
                  ]}
                  onPress={() => toggleTask(item)}
                >

                  <Text style={styles.checkboxText}>
                    {item.completed ? "✓" : ""}
                  </Text>

                </TouchableOpacity>

                {!isOwner && (
                  <Text style={styles.readOnly}>
                    Apenas leitura
                  </Text>
                )}

              </View>
            );
          }}
        />

        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
        >
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
    textAlign: "center",
    marginBottom: 20,
  },

  taskCard: {
    backgroundColor: "#f99d30",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#091d34",
  },

  taskDescription: {
    marginTop: 10,
    fontSize: 16,
  },

  checkbox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#091d34",
  },

  checkboxDone: {
    backgroundColor: "#00bf63",
  },

  checkboxText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#091d34",
  },

  readOnly: {
    marginTop: 10,
    color: "#cc0000",
    fontWeight: "bold",
  },

  closeButton: {
    backgroundColor: "#cc0000",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  closeText: {
    color: "#091d34",
    fontWeight: "bold",
    fontSize: 20,
  },
});