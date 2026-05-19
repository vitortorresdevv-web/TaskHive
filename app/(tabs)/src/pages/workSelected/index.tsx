import InviteUserModal from "@/components/modal/inviteUserModal";
import { ModalConfirmarSaida } from "@/components/modal/modalConfirmarSaida";
import { ModalLider } from "@/components/modal/modalEscolherNivel3";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";

import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";

import { useEffect, useRef, useState } from "react";

import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { PieChart } from "react-native-chart-kit";

import { db } from "../../configFireBase/firebaseConfig";

export default function workSelected() {

  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  const [modalConfirmarSaida, setModalConfirmarSaida] =
    useState(false);

  const [chartData, setChartData] = useState<any[]>([]);

  const router = useRouter();

  const { groupId, nomeGrupo } =
    useLocalSearchParams();

  const [menuAberto, setMenuAberto] =
    useState(false);

  const [group, setGroup] =
    useState<any>(null);

  const slideAnim =
    useRef(new Animated.Value(300)).current;

  const { codigo } =
    useLocalSearchParams();

  const [modalLider, setModalLider] =
    useState(false);

  const [users, setUsers] =
    useState<any[]>([]);

  const [novoLider, setNovoLider] =
    useState<string | null>(null);

  const [nivelPermissao, setNivelPermissao] =
    useState(0);

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

  async function copiaCodigo() {

    await Clipboard.setStringAsync(codigo as string);

    alert("Código copiado");
  }

  async function loadParticipants() {

    try {

      if (!groupId) return;

      const groupRef =
        doc(db, "groups", String(groupId));

      const groupSnap =
        await getDoc(groupRef);

      if (!groupSnap.exists()) return;

      const participantes =
        groupSnap.data().participantes || [];

      if (participantes.length === 0) return;

      const q = query(
        collection(db, "users"),
        where("__name__", "in", participantes)
      );

      const snapshot =
        await getDocs(q);

      const list: any[] = [];

      snapshot.forEach((docItem) => {

        const auth = getAuth();

        const user =
          auth.currentUser;

        if (docItem.id !== user?.uid) {

          list.push({
            id: docItem.id,
            nome: docItem.data().nome,
          });
        }
      });

      setUsers(list);

    } catch (err) {

      console.log(err);
    }
  }

  async function sairDoTrabalho() {

    try {

      const auth = getAuth();

      const user =
        auth.currentUser;

      if (!user || !groupId) return;

      const groupRef =
        doc(db, "groups", String(groupId));

      const groupSnap =
        await getDoc(groupRef);

      if (!groupSnap.exists()) return;

      const data =
        groupSnap.data();

      if (data.creatorId === user.uid) {

        await loadParticipants();

        setModalLider(true);

      } else {

        setModalConfirmarSaida(true);
      }

    } catch (error) {

      console.log(error);
    }
  }

  async function confirmarSaidaUsuario() {

    try {

      const auth = getAuth();

      const user =
        auth.currentUser;

      if (!user || !groupId) return;

      await updateDoc(
        doc(db, "groups", String(groupId)),
        {
          participantes:
            arrayRemove(user.uid),
        }
      );

      setModalConfirmarSaida(false);

      router.push("/src/pages/home/home");

    } catch (error) {

      console.log(error);
    }
  }

  function selecionarLider(userId: string) {

    setNovoLider(userId);
  }

  async function confirmarSaida() {

    try {

      const auth = getAuth();

      const user =
        auth.currentUser;

      if (!user || !groupId || !novoLider) return;

      const groupRef =
        doc(db, "groups", String(groupId));

      await updateDoc(groupRef, {

        creatorId: novoLider,

        participantes:
          arrayRemove(user.uid),
      });

      setModalLider(false);

      router.push("/src/pages/home/home");

    } catch (err) {

      console.log(err);
    }
  }

  useEffect(() => {

    async function loadGroup() {

      if (!groupId) return;

      try {

        const auth = getAuth();

        const user =
          auth.currentUser;

        if (!user) return;

        const docRef =
          doc(db, "groups", String(groupId));

        const docSnap =
          await getDoc(docRef);

        if (docSnap.exists()) {

          const data =
            docSnap.data();

          setGroup(data);

          const permissoes =
            data.permissoes || {};

          setNivelPermissao(
            permissoes[user.uid] || 0
          );

        }

      } catch (error) {

        console.log(error);
      }
    }

    loadGroup();

  }, [groupId]);

  useEffect(() => {

    if (!groupId) return;

    const q = query(
      collection(db, "tasks"),
      where("groupId", "==", String(groupId))
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const tasks: any[] = [];

        snapshot.forEach((docItem) => {

          tasks.push({
            id: docItem.id,
            ...docItem.data(),
          });
        });

        gerarGrafico(tasks);
      });

    return () => unsubscribe();

  }, [groupId]);

  function gerarGrafico(tasks: any[]) {

    const totalTasks =
      tasks.length;

    if (totalTasks === 0) {

      setChartData([
        {
          name: "Não feito",
          population: 100,
          color: "#cc0000",
          legendFontColor: "#091d34",
          legendFontSize: 15,
        },
      ]);

      return;
    }

    const usersMap: any = {};

    let completedCount = 0;

    tasks.forEach((task) => {

      if (task.completed) {

        completedCount++;

        if (!usersMap[task.userName]) {
          usersMap[task.userName] = 0;
        }

        usersMap[task.userName]++;
      }
    });

    const colors = [
      "#f99d30",
      "#132e48",
      "#ff6384",
      "#ffce56",
      "#8e44ad",
      "#e74c3c",
      "#16a085",
      "#2ecc71",
      "#d35400",
      "#c0392b",
      "#27ae60",
      "#9b59b6",
      "#292824",
      "#34495e",
      "#1abc9c",
      "#e67e22",
      "#7f8c8d",
      "#2980b9",
      "#6c3483",
      "#145a32",
    ];

    let colorIndex = 0;

    const chart: any[] = [];

    for (const user in usersMap) {

      const percent =
        Number(
          (
            (usersMap[user] / totalTasks) * 100
          ).toFixed(1)
        );

      chart.push({

        name: user,

        population: percent,

        color:
          colors[colorIndex % colors.length],

        legendFontColor: "#091d34",

        legendFontSize: 15,
      });

      colorIndex++;
    }

    const notDone =
      Number(
        (
          100 -
          (
            (completedCount / totalTasks) * 100
          )
        ).toFixed(1)
      );

    chart.push({

      name: "Não feito",

      population: notDone,

      color: "#cc0000",

      legendFontColor: "#091d34",

      legendFontSize: 15,
    });

    setChartData(chart);
  }

  return (

    <View style={{ flex: 1 }}>

      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() =>
          setInviteModalVisible(false)
        }
        groupId={String(groupId)}
        groupName={String(nomeGrupo)}
      />

      <View style={styles.container}>

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              router.push('/src/pages/home/home')
            }
          >

            <Image
              style={styles.image}
              source={require('./imagens/seta-esquerda.png')}
            />

          </TouchableOpacity>

          <TouchableOpacity
            onPress={abrirMenu}
          >

            <Image
              style={styles.image}
              source={require('./imagens/menu-aberto.png')}
            />

          </TouchableOpacity>

        </View>

        <Text style={styles.titleText}>
          {group?.nome || "Carregando..."}
        </Text>

        <Text style={styles.text}>
          Progresso do Trabalho
        </Text>

        <View style={styles.chartWrapper}>

          <PieChart
            data={chartData}
            width={320}
            height={320}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"80"}
            hasLegend={false}
            absolute
            center={[0, 0]}
            chartConfig={{
              color: () => "#091d34",
            }}
          />

          <View style={styles.legendWrapper}>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.legendContainer}
            >

              {chartData.map((item, index) => (

                <View
                  key={index}
                  style={styles.legendItem}
                >

                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: item.color }
                    ]}
                  />

                  <View style={{ flex: 1 }}>

                    <Text
                      numberOfLines={1}
                      style={styles.legendName}
                    >
                      {item.name}
                    </Text>

                    <Text style={styles.legendPercent}>
                      {item.population}%
                    </Text>

                  </View>

                </View>

              ))}

            </ScrollView>

          </View>

        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push({
              pathname: "./tasks",
              params: { groupId },
            })
          }
        >

          <Text style={styles.buttonText}>
            Tarefas
          </Text>

        </TouchableOpacity>

      </View>

      {menuAberto && (

        <View style={styles.overlay}>

          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [
                  { translateX: slideAnim }
                ]
              }
            ]}
          >

            <TouchableOpacity
              onPress={fecharMenu}
            >

              <Text style={styles.fechar}>
                ✖
              </Text>

            </TouchableOpacity>

            {nivelPermissao >= 1 && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/src/pages/chat',
                    params: { groupId }
                  })
                }
              >
                <Text style={styles.item}>
                  Chat
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/src/pages/integrantes',
                  params: { groupId }
                })
              }
            >
              <Text style={styles.item}>
                Integrantes
              </Text>
            </TouchableOpacity>

            {nivelPermissao >= 2 && (
              <TouchableOpacity onPress={copiaCodigo}>
                <Text style={styles.item}>
                  Código Acesso
                </Text>
              </TouchableOpacity>
            )}

            {nivelPermissao >= 2 && (

              <TouchableOpacity
                onPress={() =>
                  setInviteModalVisible(true)
                }
              >

                <Text style={styles.item}>
                  Convidar
                </Text>

              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={sairDoTrabalho}
            >

              <Text
                style={[
                  styles.item,
                  styles.sair
                ]}
              >
                Sair do trabalho
              </Text>

            </TouchableOpacity>

          </Animated.View>

          <ModalLider
            visible={modalLider}
            users={users}
            novoLider={novoLider}
            onSelect={selecionarLider}
            onConfirm={confirmarSaida}
            onClose={() =>
              setModalLider(false)
            }
          />

          <ModalConfirmarSaida
            visible={modalConfirmarSaida}
            onConfirm={confirmarSaidaUsuario}
            onClose={() =>
              setModalConfirmarSaida(false)
            }
          />

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#44abe8',
  },

  btn: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: '#f99d30',
    borderRadius: 20,
    width: '90%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },

  buttonText: {
    color: "#091d34",
    fontSize: 23,
    fontWeight: "bold"
  },

  titleText: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 60,
    marginTop: 10,
    textAlign: "center",
  },

  text: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 25,
    textAlign: "center",
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

  chartWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  legendWrapper: {
    width: "95%",
    maxHeight: 180,
    marginTop: 5,
  },

  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },

  legendItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: "1%",
  },

  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 8,
  },

  legendName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#091d34",
  },

  legendPercent: {
    fontSize: 12,
    color: "#333",
  },
});