import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ObjectivesListScreen from "./screens/ObjectivesListScreen";
import ObjectiveFormScreen from "./screens/ObjectiveFormScreen";
import { RootStackParamList } from "./types";
import "react-native-gesture-handler";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="ObjectivesList"
          component={ObjectivesListScreen}
          options={{ title: "Lista de Objetivos" }}
        />
        <Stack.Screen
          name="ObjectiveForm"
          component={ObjectiveFormScreen}
          options={{ title: "Criar/Editar Objetivo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
