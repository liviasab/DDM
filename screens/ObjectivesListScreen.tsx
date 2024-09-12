import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  ObjetivosList: undefined;
  ObjetivoForm: { objective?: ObjectiveType };
};

type Props = NativeStackScreenProps<RootStackParamList, "ObjectivesList">;

type ObjectiveType = {
  id: string;
  equipment: string;
  currentWeight: string;
  goal: string;
  date: string;
  photo: string | null;
};

export default function ObjetivosListScreen({ navigation }: Props) {
  const [objectives, setObjectives] = useState<ObjectiveType[]>([]);

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const objectivesSnapshot = await getDocs(
        collection(db, "users", user.uid, "objectives")
      );
      const fetchedObjectives: ObjectiveType[] = [];
      objectivesSnapshot.forEach((doc) => {
        fetchedObjectives.push({ ...doc.data(), id: doc.id } as ObjectiveType);
      });
      setObjectives(fetchedObjectives);
    } catch (error) {
      console.error("Erro ao buscar objetivos: ", error);
    }
  };

  const renderObjectiveItem = ({ item }: { item: ObjectiveType }) => (
    <View style={styles.objectiveItem}>
      <Text style={styles.info}>Equipamento: {item.equipment}</Text>
      <Text style={styles.info}>Peso Atual: {item.currentWeight} kg</Text>
      <Text style={styles.info}>Objetivo: {item.goal}</Text>
      <Button
        title="Editar"
        onPress={() =>
          navigation.navigate("ObjectiveForm", { objective: item })
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={objectives}
        renderItem={renderObjectiveItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Adicionar Objetivo"
        onPress={() => navigation.navigate("ObjectiveForm")}
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
  objectiveItem: {
    backgroundColor: "#333",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  info: {
    color: "#fff",
  },
});
