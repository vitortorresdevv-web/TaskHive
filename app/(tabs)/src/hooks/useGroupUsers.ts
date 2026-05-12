import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../configFireBase/firebaseConfig";

export function useGroupUsers(groupId: string, reload: boolean) {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadUsers() {

      try {

        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) return;

        const participantes = groupSnap.data().participantes || [];

        if (participantes.length === 0) {
          setUsers([]);
          return;
        }

        const q = query(
          collection(db, "users"),
          where("__name__", "in", participantes)
        );

        const snapshot = await getDocs(q);

        const list: any[] = [];

        snapshot.forEach((doc) => {

          const data = doc.data();

          list.push({
            id: doc.id,
            nome: data.nome,
            cpf: data.cpf,
            fotoPerfil: data.fotoPerfil || null,
          });

        });

        setUsers(list);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    if (groupId) {
      loadUsers();
    }

  }, [groupId]);

  return { users, loading };
}