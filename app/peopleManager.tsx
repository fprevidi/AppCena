import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from 'expo-router';
import { peopleList } from "../src/people"; // 👈 Importiamo la lista iniziale
interface Person {
  id: number;
  name: string;
}

const PeopleManagerScreen: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [newName, setNewName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadPeople = async () => {
      const storedPeople = await AsyncStorage.getItem("peopleList");
      if (storedPeople) {
        setPeople(JSON.parse(storedPeople)); 
      } else {
        setPeople(peopleList); // 👈 Se `AsyncStorage` è vuoto, usa `peopleList`
        await AsyncStorage.setItem("peopleList", JSON.stringify(peopleList)); // 👈 Salva la lista iniziale
      }
    };
    loadPeople();
  }, []);
  

  const savePeople = async (updatedPeople: Person[]) => {
    setPeople(updatedPeople);
    await AsyncStorage.setItem("peopleList", JSON.stringify(updatedPeople));
  };

  const addPerson = () => {
    if (newName.trim() === "") return;
    const newPerson = { id: Date.now(), name: newName };
    const updatedPeople = [...people, newPerson];
    savePeople(updatedPeople);
    setNewName("");
  };

  const deletePerson = (id: number) => {
    Alert.alert("Elimina", "Vuoi davvero eliminare questa persona?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => {
          const updatedPeople = people.filter((person) => person.id !== id);
          savePeople(updatedPeople);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Gestione Persone</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={people}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity onPress={() => deletePerson(item.id)}>
                <Icon name="trash-can-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* INPUT E BOTTONE PER AGGIUNGERE */}
        <View style={styles.addContainer}>
          <TextInput
            style={styles.input}
            placeholder="Inserisci nuovo nome"
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity style={styles.addButton} onPress={addPerson}>
            <Icon name="plus-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 10 },
  header: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 2, borderBottomColor: "#000" },
  headerText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  name: { fontSize: 18 },
  addContainer: { flexDirection: "row", padding: 10, borderTopWidth: 2, borderTopColor: "#000" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  addButton: { backgroundColor: "black", padding: 10, borderRadius: 50, marginLeft: 10 },
});

export default PeopleManagerScreen;
