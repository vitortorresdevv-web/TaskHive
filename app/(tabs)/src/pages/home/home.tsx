import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../configFireBase/firebaseConfig';

type Group = {
  id: string;
  nome: string;
  participantes: number;
};

export default function Index() {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);

  async function loadGroups() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "groups"),
        where("participantes", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const list: Group[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        list.push({
          id: doc.id,
          nome: data.nome || "Sem nome",
          participantes: Array.isArray(data.participantes)
          ? data.participantes.length
          : 0,
        });
      });

      setGroups(list);

    } catch (error) {
      console.log("Erro ao carregar grupos:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/src/pages/workSelected",
                params: { groupId: item.id },
              })
            }
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardText}>
                Participantes: {item.participantes}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Image
              style={styles.image}
              source={require("../home/images/Lupa-image.png")}
            />
            <Text style={styles.text}>
              Você ainda não participa de nenhum projeto
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#44abe8",
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 250,
    height: 250,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#091d34",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f99d30",
    margin: 10,
    padding: 15,
    borderRadius: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#091d34",
  },

  cardText: {
    marginTop: 5,
    color: "#333",
  },
});