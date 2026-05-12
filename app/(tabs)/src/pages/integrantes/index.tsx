import { useGroupUsers } from "@/app/(tabs)/src/hooks/useGroupUsers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { arrayRemove, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../configFireBase/firebaseConfig";

import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Integrantes() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const { groupId } = useLocalSearchParams();
    const [reload, setReload] = useState(false);
    const { users, loading } = useGroupUsers(String(groupId), reload);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isCreator, setIsCreator] = useState(false);
    const [nivelPermissao, setNivelPermissao] = useState(0);

    useEffect(() => {
        async function verificarCreator() {

            if (!groupId || !currentUser) return;

            const groupRef = doc(db, "groups", String(groupId));
            const groupSnap = await getDoc(groupRef);

            if (!groupSnap.exists()) return;

            const data = groupSnap.data();

            const nivel = data.permissoes?.[currentUser.uid] || 0;
            setNivelPermissao(nivel);

            setIsCreator(data.creatorId === currentUser.uid);
        }

        verificarCreator();

    }, [groupId, currentUser]);

    async function removerIntegrante() {
        try {

            if (!selectedUser?.id || !groupId) {
            console.log("Usuário inválido");
            return;
            }

            console.log("Removendo:", selectedUser.id);

            await updateDoc(doc(db, "groups", String(groupId)), {
            participantes: arrayRemove(selectedUser.id),
            [`permissoes.${selectedUser.id}`]: deleteField()
            });

            setMenuVisible(false);
            setReload(prev => !prev);

        } catch (error) {
            console.log("Erro ao remover integrante:", error);
        }
    }
    async function alterarPermissao(userId: string, nivel: number) {
        await updateDoc(doc(db, "groups", String(groupId)), {
            [`permissoes.${userId}`]: nivel
        });

    }

  return (

    <View style={styles.container}>

      <FlatList
        data={users?.filter(user => user.id !== currentUser?.uid)}
        keyExtractor={(item) => item.id}

        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 40,
        }}

        renderItem={({ item }) => (

          <View style={styles.userCard}>

            <View>

              <Text style={styles.userText}>
                {item.nome}
              </Text>

              <Text style={styles.cpfText}>
                CPF: {item.cpf}
              </Text>

            </View>

            {nivelPermissao >= 2 && (
                <TouchableOpacity
                    onPress={() => {
                        setSelectedUser(item);
                        setMenuVisible(true);
                    }}
                >
                    <Ionicons
                        name="ellipsis-vertical"
                        size={24}
                        color="#091d34"
                    />
                </TouchableOpacity>
            )}

          </View>

        )}
      />

      <Modal visible={menuVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>

            <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                    {selectedUser?.nome}
                </Text>

                <TouchableOpacity onPress={removerIntegrante} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                    Remover integrante
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>
                    Permissões
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setMenuVisible(false)}
                >
                    <Text style={styles.cancelText}>
                    Cancelar
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#44abe8",
  },

  userCard: {
    backgroundColor: "#f99d30",
    padding: 15,
    marginTop: 10,
    width: 320,
    borderRadius: 15,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
  },

  cpfText: {
    marginTop: 5,
    color: "#333",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
},

  modalBox: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
},

  modalButton: {
    backgroundColor: "#f99d30",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
},

  modalButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#091d34",
    fontSize: 16,
},

cancelText: {
    marginTop: 20,
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
},

});