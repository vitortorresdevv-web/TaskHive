import { getAuth } from "firebase/auth";

import {
    arrayUnion,
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
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { db } from "../../../app/(tabs)/src/configFireBase/firebaseConfig";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function InvitesModal({
  visible,
  onClose,
}: Props) {

  const auth = getAuth();

  const currentUser = auth.currentUser;

  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {

    if (!currentUser) return;

    const q = query(
      collection(db, "invites"),
      where("toUserId", "==", currentUser.uid),
      where("status", "==", "pendente")
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

      setInvites(list);

    });

    return () => unsubscribe();

  }, []);

  async function aceitarConvite(invite: any) {

    try {

      const groupRef = doc(db, "groups", invite.groupId);

      await updateDoc(groupRef, {
        participantes: arrayUnion(currentUser?.uid),
      });

      const inviteRef = doc(db, "invites", invite.id);

      await updateDoc(inviteRef, {
        status: "aceito",
      });

    } catch (error) {
      console.log(error);
    }
  }

  async function recusarConvite(invite: any) {

    try {

      const inviteRef = doc(db, "invites", invite.id);

      await updateDoc(inviteRef, {
        status: "recusado",
      });

    } catch (error) {
      console.log(error);
    }
  }

  return (

      <View style={styles.container}>

        <View style={styles.conteudo}>


        <Text style={styles.title}>
          Caixa de Entrada
        </Text>

        <FlatList
          data={invites}
          keyExtractor={(item) => item.id}

          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              Nenhum convite pendente
            </Text>
          )}

          renderItem={({ item }) => (

            <View style={styles.card}>

              <Text style={styles.groupName}>
                {item.groupName}
              </Text>

              <Text style={styles.inviteText}>
                Convite para entrar no grupo
              </Text>

              <View style={styles.buttonsContainer}>

                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => aceitarConvite(item)}
                >
                  <Text style={styles.buttonText}>
                    Aceitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => recusarConvite(item)}
                >
                  <Text style={styles.buttonText}>
                    Recusar
                  </Text>
                </TouchableOpacity>
                
              </View>

            </View>

        
          )}
        />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeText}>
            Fechar
          </Text>
        </TouchableOpacity>

          </View>

        </View>

  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "rgba(24, 24, 24, 0.6)",
    flex: 1,
    padding: "5%",
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#091d34",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#091d34",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },

  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },

  inviteText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  acceptButton: {
    backgroundColor: "#00bf63",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center",
  },

  rejectButton: {
    backgroundColor: "#cc0000",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  closeButton: {
    backgroundColor: "#091d34",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  closeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
  },

  conteudo: {
    backgroundColor: "#f99d30",
    padding: 20,
    borderRadius: 20,
    flex: 1,
  }

});