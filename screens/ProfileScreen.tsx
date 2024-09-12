import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { auth, db } from "../firebaseConfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user.uid); 
      } else {
        navigation.navigate("Login");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setAge(userData.age || "");
        setBloodType(userData.bloodType || "");
        setWeight(userData.weight || "");
      } else {
        console.log("Documento do usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Firestore: ", error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Perfil do Usuário</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>Nome: {name}</Text>
          <Text style={styles.info}>Idade: {age}</Text>
          <Text style={styles.info}>Tipo Sanguíneo: {bloodType}</Text>
          <Text style={styles.info}>Peso: {weight} kg</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ObjectivesList")}
          >
            <Text style={styles.buttonText}>Ir para Objetivos</Text>
          </TouchableOpacity>

          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text style={styles.title}>Verificando autenticação...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 20,
  },
  info: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00C853",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
