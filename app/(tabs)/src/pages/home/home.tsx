import { useRouter } from 'expo-router';

import { getAuth } from 'firebase/auth';

import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { useEffect, useState } from 'react';

import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { db } from '../../configFireBase/firebaseConfig';

type Group = {
  id: string;
  nome: string;
  participantes: number;
  userId: string;
  codigo: string;
  status?: "pendente" | "concluído";
};

export default function Index() {

  const [openFilter, setOpenFilter] = useState(false);

  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);

  const [filter, setFilter] = useState("todos");

  useEffect(() => {

    const auth = getAuth();

    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "groups"),
      where("participantes", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const list: Group[] = [];

      snapshot.forEach((docItem) => {

        const data = docItem.data();

        list.push({
          id: docItem.id,
          nome: data.nome || "Sem nome",

          participantes:
            Array.isArray(data.participantes)
              ? data.participantes.length
              : 0,

          codigo: data.codigo || "",

          userId: data.userId || "",

          status: "pendente",
        });
      });

      setGroups(list);

    });

    return () => unsubscribe();

  }, []);

  const filteredGroups = groups.filter((group) => {

  if (filter === "todos") {
    return true;
  }

  if (filter === "pendentes") {
    return group.status === "pendente";
  }

  if (filter === "concluidos") {
    return group.status === "concluído";
  }

  return true;
});

  return (
    <View style={styles.container}>

    <View style={styles.filterWrapper}>

      <TouchableOpacity
        style={styles.mainFilterButton}
        onPress={() => setOpenFilter(!openFilter)}
      >
        <Image
          source={require("./images/filter.png")}
          style={{ width: 35, height: 35}}
        />
    </TouchableOpacity>

  {openFilter && (

    <View style={styles.dropdown}>

      <TouchableOpacity
        style={styles.filterOption}
        onPress={() => {
          setFilter("todos");
          setOpenFilter(false);
        }}
      >
        <Text style={styles.optionText}>
          Todos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterOption}
        onPress={() => {
          setFilter("pendentes");
          setOpenFilter(false);
        }}
      >
        <Text style={styles.optionText}>
          Pendentes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterOption}
        onPress={() => {
          setFilter("concluidos");
          setOpenFilter(false);
        }}
      >
        <Text style={styles.optionText}>
          Concluídos
        </Text>
      </TouchableOpacity>

    </View>

  )}

</View>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/src/pages/workSelected",
                params: {
                  groupId: item.id,
                  codigo: item.codigo,
                },
              })
            }
          >

            <View style={styles.card}>

              <Text style={styles.cardTitle}>
                {item.nome}
              </Text>

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

filterWrapper: {
  alignItems: "flex-end",
  marginTop: 20,
  marginRight: 20,
},

mainFilterButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 15,
},

mainFilterText: {
  color: "white",
  fontWeight: "bold",
},

dropdown: {
  marginTop: 10,
  backgroundColor: "#091d34",
  borderRadius: 15,
  overflow: "hidden",
},

filterOption: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#44abe8",
},

optionText: {
  color: "white",
  fontWeight: "bold",
},

});