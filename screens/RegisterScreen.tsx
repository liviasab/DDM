import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore"; 

type RegisterScreenProps = StackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

     
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        age: age,
        bloodType: bloodType,
        weight: weight,
        email: email,
      });

      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor="#999"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo Sanguíneo"
        placeholderTextColor="#999"
        value={bloodType}
        onChangeText={setBloodType}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        placeholderTextColor="#999"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Criar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.switchText}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: "#00C853",
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#00C853",
    marginTop: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
