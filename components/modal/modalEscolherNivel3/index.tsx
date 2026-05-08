import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  users: any[];
  novoLider: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export function ModalLider({
  visible,
  users,
  novoLider,
  onSelect,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center" }}>

        <View style={{ backgroundColor: "white", margin: 20, borderRadius: 10, padding: 20 }}>

          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: 'center' }}>
            Escolha o novo líder
          </Text>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item.id)}
                style={{
                  padding: 10,
                  backgroundColor: novoLider === item.id ? "#f99d30" : "#eee",
                  marginBottom: 5,
                  borderRadius: 10,
                }}
              >
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity onPress={onConfirm} style={styles.button}>
            <Text style={{ marginTop: 20, textAlign: "center", fontWeight: "bold" }}>
              Confirmar saída
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 15, textAlign: "center", color: "red" }}>
              Cancelar
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    button: {
        
    },
})