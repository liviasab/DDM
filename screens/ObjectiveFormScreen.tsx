import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  ObjetivosList: undefined;
  ObjetivoForm: { objective?: ObjectiveType };
};

type Props = NativeStackScreenProps<RootStackParamList, "ObjetivoForm">;

type ObjectiveType = {
  id: string;
  equipment: string;
  currentWeight: string;
  goal: string;
  date: string;
  photo: string | null;
};

export default function ObjetivoFormScreen({ route, navigation }: Props) {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editObjectiveId, setEditObjectiveId] = useState<string | null>(null);

  useEffect(() => {
    if (route.params && route.params.objective) {
      const { objective } = route.params;
      setIsEditing(true);
      setEditObjectiveId(objective.id);
      setEquipment(objective.equipment);
      setCurrentWeight(objective.currentWeight);
      setGoal(objective.goal);
      setDate(objective.date);
      setCurrentPhoto(objective.photo);
    }
  }, [route.params]);

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setCurrentPhoto(pickerResult.assets[0].uri);
    }
  };

  const handleSaveObjective = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      alert("Você precisa estar autenticado.");
      return;
    }

    try {
      if (isEditing && editObjectiveId) {
        const objectiveRef = doc(
          db,
          "users",
          user.uid,
          "objectives",
          editObjectiveId
        );
        await updateDoc(objectiveRef, {
          equipment,
          currentWeight,
          goal,
          date,
          photo: currentPhoto || "",
        });
        alert("Objetivo atualizado!");
      } else {
        await addDoc(collection(db, "users", user.uid, "objectives"), {
          equipment,
          currentWeight,
          goal,
          date,
          photo: currentPhoto || "",
          repetitions: "10-12 fixo",
        });
        alert("Objetivo adicionado!");
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Editar Objetivo" : "Novo Objetivo"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Equipamento"
        value={equipment}
        onChangeText={setEquipment}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso atual"
        value={currentWeight}
        onChangeText={setCurrentWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Objetivo"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>Adicionar/Atualizar Foto</Text>
      </TouchableOpacity>

      {currentPhoto && (
        <Image source={{ uri: currentPhoto }} style={styles.photo} />
      )}

      <Button
        title={isEditing ? "Atualizar" : "Salvar"}
        onPress={handleSaveObjective}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  photoButton: {
    backgroundColor: "#00C853",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  photoButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
