import InviteUserModal from "@/components/modal/inviteUserModal";
import { ModalConfirmarSaida } from "@/components/modal/modalConfirmarSaida";
import { ModalLider } from "@/components/modal/modalEscolherNivel3";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";
import { arrayRemove, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../configFireBase/firebaseConfig";

export default function workSelected(){

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleLider, setModalVisibleLider] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [modalConfirmarSaida, setModalConfirmarSaida] = useState(false);

    async function sairDoTrabalho() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !groupId) return;

        const groupRef = doc(db, "groups", String(groupId));
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) return;

        const data = groupSnap.data();

        if (data.creatorId === user.uid) {

          await loadParticipants();
          setModalLider(true);

        } 
        else {

          setModalConfirmarSaida(true);

        }

      } catch (error) {
        console.log("Erro ao verificar creatorId:", error);
      }
    }

    async function confirmarSaidaUsuario() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !groupId) return;

        await updateDoc(doc(db, "groups", String(groupId)), {
          participantes: arrayRemove(user.uid),
        });

        setModalConfirmarSaida(false);

        router.push("/src/pages/home/home");

      } catch (error) {
        console.log("Erro ao sair do trabalho:", error);
      }
    }

  const router = useRouter();
  const { groupId, nomeGrupo } = useLocalSearchParams(); 

  const [menuAberto, setMenuAberto] = useState(false);
  const [group, setGroup] = useState<any>(null);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const{ codigo } = useLocalSearchParams();

  function abrirMenu() {
    setMenuAberto(true);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function fecharMenu() {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuAberto(false));
  }

  const [modalLider, setModalLider] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [novoLider, setNovoLider] = useState<string | null>(null);
  const [nivelPermissao, setNivelPermissao] = useState(0);

  async function loadParticipants() {
  try {
    if (!groupId) return;

    const groupRef = doc(db, "groups", String(groupId));
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) return;

    const participantes = groupSnap.data().participantes || [];

    if (participantes.length === 0) return;

    const q = query(
      collection(db, "users"),
      where("__name__", "in", participantes)
    );

    const snapshot = await getDocs(q);

    const list: any[] = [];

    snapshot.forEach((doc) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (doc.id !== user?.uid) {
      list.push({
        id: doc.id,
        nome: doc.data().nome,
      });
    }
    });

    setUsers(list);
  } catch (err) {
    console.log(err);
  }
}

  function abrirModalSair() {
    loadParticipants();
    setModalLider(true);
  }

  function selecionarLider(userId: string) {
    setNovoLider(userId);
  }

  async function confirmarSaida() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !groupId || !novoLider) return;

      const groupRef = doc(db, "groups", String(groupId));

      await updateDoc(groupRef, {
        creatorId: novoLider,
        participantes: arrayRemove(user.uid),
      });

      setModalLider(false);
      router.push("/src/pages/home/home");

    } catch (err) {
      console.log(err);
    }
  }

  async function copiaCodigo(){
    await Clipboard.setStringAsync(codigo as string);
    alert('codigo de acesso copiado');
  }

  
  useEffect(() => {

    async function loadGroup() {

      if (!groupId) return;

      try {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const docRef = doc(db, "groups", String(groupId));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          const data = docSnap.data();

          setGroup(data);

          const permissoes = data.permissoes || {};

          setNivelPermissao(permissoes[user.uid] || 0);

        } else {

          console.log("Grupo não encontrado");

        }

      } catch (error) {

        console.log("Erro ao buscar grupo:", error);

      }

    }

    loadGroup();

  }, [groupId]);

  return(
    <View style={{ flex: 1 }}>

      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}

        groupId={String(groupId)}
        groupName={String(nomeGrupo)}
      />

      <View style={styles.container}>


        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/src/pages/home/home')}>
            <Image style={styles.image} source={require('./imagens/seta-esquerda.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={abrirMenu}>
            <Image style={styles.image} source={require('./imagens/menu-aberto.png')} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titleText}>
          {group?.nome || "Carregando..."}
        </Text>

        <Text style={styles.text}>Progresso do Trabalho</Text>

          <TouchableOpacity style={styles.btn} onPress={() => router.push({
            pathname: "./tasks",
            params: { groupId },
          })}>
            <Text style={styles.buttonText}>Tarefas</Text>
          </TouchableOpacity>

      </View>

      {menuAberto && (
        <View style={styles.overlay}>
          
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >

            <TouchableOpacity onPress={fecharMenu}>
              <Text style={styles.fechar}>✖</Text>
            </TouchableOpacity>

            {nivelPermissao >= 1 &&(
              <TouchableOpacity onPress={() => router.push({pathname: '/(tabs)/src/pages/chat', params: { groupId }})}><Text style={styles.item}>Chat</Text></TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/src/pages/integrantes',params: { groupId }})}><Text style={styles.item}>Integrantes</Text></TouchableOpacity>
            {nivelPermissao >=2 &&(
              <TouchableOpacity onPress={copiaCodigo}><Text style={styles.item}>Código Acesso</Text></TouchableOpacity>
            )}

            {nivelPermissao >= 2 &&(
              <TouchableOpacity onPress={() => setInviteModalVisible(true)}><Text style={styles.item}>Convidar</Text></TouchableOpacity>
            )}
            <TouchableOpacity onPress={sairDoTrabalho}><Text style={[styles.item, styles.sair]}>Sair do trabalho</Text></TouchableOpacity>

          </Animated.View>

          <ModalLider
            visible={modalLider}
            users={users}
            novoLider={novoLider}
            onSelect={selecionarLider}
            onConfirm={confirmarSaida}
            onClose={() => setModalLider(false)}
          />

          <ModalConfirmarSaida
            visible={modalConfirmarSaida}
            onConfirm={confirmarSaidaUsuario}
            onClose={() => setModalConfirmarSaida(false)}
          />

        </View>
      )}

    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#44abe8',
  },

  btn: {
    backgroundColor: '#f99d30',
    borderRadius: 20,
    width: '90%',
    marginTop: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  buttonText:{
    color: "#091d34",
    fontSize: 23,
    fontWeight: "bold"
  },

  titleText: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 60,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 50,
  },
  
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },

  image: {
    width: 35,
    height: 35,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: '60%',
    height: "100%",
    backgroundColor: "rgba(19, 46, 72, 0.75)",
    padding: 20,
  },

  item: {
    color: "#132e48",
    fontSize: 23,
    marginTop: 20,
    marginBottom: 35,
    backgroundColor: '#f99d30',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  sair: {
    backgroundColor: '#cc0000',
    color: 'white',
  },

  fechar: {
    top: 10,
    marginBottom: 36,
    color: "white",
    fontSize: 22,
    fontWeight: 'bold',
  },
});
