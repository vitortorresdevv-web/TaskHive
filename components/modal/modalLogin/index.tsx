import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../app/(tabs)/src/configFireBase/firebaseConfig';
import { ModalFormCadastro } from '../modalCadastro';

export function ModalFormLogin(){
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [cpf, setcpf] = useState("");
    const [senha, setSenha] = useState("");

    async function cpfExiste(cpfLimpo: string) {
        const ref = doc(db, 'cpf_index', cpfLimpo);
        const snap = await getDoc(ref);
        return snap.exists();
    }

    async function autenticar() {
        const cpfLimpo = cpf.replace(/\D/g, "");
        const emailFake = cpfLimpo + '@taskhive.com';

        if (!cpfLimpo || !senha) {
            Alert.alert("Erro", "Preencha CPF e senha");
            return;
        }

        if (cpfLimpo.length !== 11) {
            Alert.alert("Erro", "CPF inválido");
            return;
        }

        try {
            const existe = await cpfExiste(cpfLimpo);

            if (existe) {
                await signInWithEmailAndPassword(auth, emailFake, senha);
                router.push('../../src/pages/home');
            } else {
                setModalVisible(true);
            }

        } catch {
            Alert.alert("Erro", "Falha ao autenticar");
        }
    }

    async function cadastrar(nome: string) {
        const cpfLimpo = cpf.replace(/\D/g, "");
        const emailFake = cpfLimpo + '@taskhive.com';

        if (!nome) {
            Alert.alert("Erro", "Digite o nome");
            return;
        }

        if (cpfLimpo.length !== 11) {
            Alert.alert("Erro", "CPF inválido");
            return;
        }

        if (senha.length < 6) {
            Alert.alert("Erro", "Senha deve ter no mínimo 6 caracteres");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailFake,
                senha
            );

            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                cpf: cpfLimpo,
                nome: nome,
                createdAt: new Date(),
            });

            await setDoc(doc(db, 'cpf_index', cpfLimpo), {
                cpf: cpfLimpo
            });

            setModalVisible(false);
            router.push('../../src/pages/home');

        } catch (error: any) {

            if (error.code === "auth/email-already-in-use") {
                try {
                    await signInWithEmailAndPassword(auth, emailFake, senha);
                    router.push('../../src/pages/home');
                } catch {
                    Alert.alert("Erro", "Senha incorreta");
                }

            } else {
                Alert.alert("Erro", "Erro ao cadastrar usuário");
            }
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.text}>CPF:</Text>
                
                <TextInput 
                    placeholder='XXX.XXX.XXX-YY'
                    value={cpf}
                    onChangeText={setcpf} 
                    style={styles.input}
                />

                <Text style={[styles.text, styles.textAbaixo]}>SENHA:</Text>
                
                <TextInput 
                    placeholder='********'
                    value={senha}
                    onChangeText={setSenha} 
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Modal visible={modalVisible} animationType="fade" transparent>
                    <ModalFormCadastro
                        onCadastrar={cadastrar}
                        onClose={() => setModalVisible(false)}
                    />
                </Modal>

                <TouchableOpacity style={styles.buttonContinuar} onPress={autenticar}>
                    <Text style={styles.textButtonContinuar}>CONFIRMAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    conteudo: {
        backgroundColor: "#091d34",
        width: 280,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
    },

    text: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 30,
    },

    textAbaixo: {
        marginTop: 50,
    },
    
    input: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 180,
        fontWeight: "bold",
        paddingVertical: 9,
        textAlign: "center",
    },

    buttonContinuar: {
        marginTop: 30,
        backgroundColor: "#f99d30",
        borderRadius: 10
    },
    
    textButtonContinuar: {
        color: "#091d34",
        fontWeight: "bold",
        fontSize: 19,
        padding: 6,
    },
});