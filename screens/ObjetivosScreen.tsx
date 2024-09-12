import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebaseConfig"; 
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

export default function ObjetivosScreen() {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [equipment, setEquipment] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [objectives, setObjectives] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editObjectiveId, setEditObjectiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchObjectives(); 
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      alert("Permissão para acessar a mídia é necessária!");
      return;
    }

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
    try {
      const user = getAuth().currentUser; 
      if (!user) {
        alert("Você precisa estar autenticado para salvar objetivos.");
        return;
      }

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
        alert("Objetivo atualizado com sucesso!");
        setIsEditing(false);
        setEditObjectiveId(null);
      } else {
        
        await addDoc(collection(db, "users", user.uid, "objectives"), {
          equipment,
          currentWeight,
          goal,
          date,
          photo: currentPhoto || "", 
          repetitions: "10-12 fixo", 
        });
        alert("Objetivo salvo com sucesso!");
      }

      
      setEquipment("");
      setCurrentWeight("");
      setGoal("");
      setCurrentPhoto(null);

      
      fetchObjectives();
    } catch (error) {
      console.error("Erro ao salvar o objetivo: ", error);
      alert("Erro ao salvar o objetivo. Tente novamente.");
    }
  };

  const fetchObjectives = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        return;
      }

      const objectivesSnapshot = await getDocs(
        collection(db, "users", user.uid, "objectives")
      );
      const fetchedObjectives: any[] = [];
      objectivesSnapshot.forEach((doc) => {
        fetchedObjectives.push({ ...doc.data(), id: doc.id });
      });
      setObjectives(fetchedObjectives); 
    } catch (error) {
      console.error("Erro ao buscar os objetivos: ", error);
    }
  };

  const handleEditObjective = (objective: any) => {
    setIsEditing(true);
    setEditObjectiveId(objective.id);
    setEquipment(objective.equipment);
    setCurrentWeight(objective.currentWeight);
    setGoal(objective.goal);
    setDate(objective.date);
    setCurrentPhoto(objective.photo);
  };

  const renderObjectiveItem = ({ item }: any) => (
    <View style={styles.objectiveItem}>
      <Text style={styles.info}>Equipamento: {item.equipment}</Text>
      <Text style={styles.info}>Peso Atual: {item.currentWeight} kg</Text>
      <Text style={styles.info}>Objetivo: {item.goal}</Text>
      <Text style={styles.info}>Data: {item.date}</Text>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.photo} />
      ) : null}
      <Button title="Editar" onPress={() => handleEditObjective(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Editar Objetivo" : "Adicionar Objetivo"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do aparelho"
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
        placeholder="Objetivo atual"
        value={goal}
        onChangeText={setGoal}
      />

      <Text style={styles.info}>Repetições: 10-12 (fixo)</Text>

      <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
        <Text style={styles.addPhotoButtonText}>Adicionar/Atualizar Foto</Text>
      </TouchableOpacity>

      {currentPhoto && (
        <View>
          <Image source={{ uri: currentPhoto }} style={styles.photo} />
          <Text style={styles.date}>Data: {date}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveObjective}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Atualizar Objetivo" : "Salvar Objetivo"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={objectives}
        renderItem={renderObjectiveItem}
        keyExtractor={(item) => item.id}
        style={styles.objectiveList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    fontSize: 18,
  },
  addPhotoButton: {
    backgroundColor: "#00C853",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  addPhotoButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  date: {
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  objectiveList: {
    marginTop: 20,
    width: "100%",
  },
  objectiveItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  info: {
    color: "#fff",
    fontSize: 16,
  },
});
