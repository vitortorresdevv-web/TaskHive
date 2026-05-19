import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "firebase/firestore";

import { useEffect, useState } from "react";

import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { db } from "@/app/(tabs)/src/configFireBase/firebaseConfig";

export default function Chat() {

  const router = useRouter();

  const { groupId } = useLocalSearchParams();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [mensagem, setMensagem] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {

    const q = query(
      collection(db, "groups", String(groupId), "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const lista: any[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setMessages(lista);

    });

    return () => unsubscribe();

  }, []);

    async function enviarMensagem() {

    if (!mensagem.trim()) return;
    if (!currentUser) return;

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        const userData = userSnap.data();

        await addDoc(
        collection(db, "groups", String(groupId), "messages"),
        {
            texto: mensagem,
            userId: currentUser.uid,
            nome: userData?.nome || "Usuário",
            createdAt: serverTimestamp()
        }
        );

        setMensagem("");

    } catch (error) {

        console.log(error);

    }
    }

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          NOME DO TRABALHO
        </Text>

      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}

        renderItem={({ item }) => {

          const minhaMensagem =
            item.userId === currentUser?.uid;

          return (

            <View
              style={[
                styles.messageContainer,

                minhaMensagem
                  ? styles.rightContainer
                  : styles.leftContainer
              ]}
            >

              {!minhaMensagem && (

                <Image
                  source={{
                    uri: "https://i.imgur.com/6VBx3io.png"
                  }}
                  style={styles.avatar}
                />

              )}

              <View>

                {!minhaMensagem && (
                  <Text style={styles.nome}>
                    {item.nome}
                  </Text>
                )}

                <View
                  style={[
                    styles.messageBox,

                    minhaMensagem
                      ? styles.myMessage
                      : styles.otherMessage
                  ]}
                >

                  <Text
                    style={[
                      styles.messageText,

                      minhaMensagem && {
                        color: "#091d34"
                      }
                    ]}
                  >
                    {item.texto}
                  </Text>

                </View>

              </View>

            </View>

          );
        }}
      />

      <View style={styles.inputArea}>

        <TextInput
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="digite uma mensagem"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />

        <TouchableOpacity
          onPress={enviarMensagem}
        >
          <Text style={styles.send}>
            ➤
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#44abe8",
  },

  header: {
    backgroundColor: "#091d34",
    height: 90,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
    paddingTop: 30,
  },

  back: {
    color: "#f99d30",
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: 'flex-start',
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    alignSelf: 'center',
  },

  messageContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  leftContainer: {
    alignSelf: "flex-start",
  },

  rightContainer: {
    alignSelf: "flex-end",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },

  nome: {
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },

  messageBox: {
    padding: 15,
    borderRadius: 15,
    maxWidth: 240,
  },

  myMessage: {
    backgroundColor: "#f99d30",
  },

  otherMessage: {
    backgroundColor: "white",
  },

  messageText: {
    color: "black",
    fontSize: 18,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",

    padding: 15,
    marginBottom: 10,
  },

    input: {
    flex: 1,
    backgroundColor: "#e5e5e5",

    borderRadius: 30,

    paddingHorizontal: 20,
    paddingVertical: 12,

    fontSize: 18,

    textAlignVertical: "center",
    },

  send: {
    fontSize: 40,
    color: "#f99d30",
    marginLeft: 10,
    fontWeight: "bold",
  },
});