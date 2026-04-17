import { StyleSheet, Text, View } from "react-native"

export function ModalEstatiscaPerfil(){
    return(
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <View style={styles.titleAlign}>
                    <Text style={styles.Title}>Estatísticas:</Text>
                </View>
                <Text style={styles.info}>Projetos Concluídos: 3</Text>
                <Text style={styles.info}>Projetos Pendentes: 2</Text>
                <Text style={styles.info}>Média de Colaboração: 30%</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        justifyContent: 'center',
    },

    conteudo: {
        backgroundColor: '#132e48',
        borderRadius: 20,
        width: 280,
        justifyContent: 'flex-start',
    },

    Title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 20,
    },

    info: {
        fontSize: 18,
        color: 'white',
        paddingVertical: 14,
        marginLeft: "10%",
        fontWeight: 'bold',
    },

    titleAlign: {
        alignItems: 'center',
    },
})