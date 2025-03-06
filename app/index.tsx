import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { peopleList } from "../src/people";
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';
interface FlagState {
  [key: number]: string;
}

// Opzioni disponibili
const OPTIONS = {
  FULL: "Raduno e Cena",
  RADUNO: "Solo Raduno",
  ZOOM: "Zoom",
  NONE: "Non ci sono",
};

const PeopleScreen: React.FC = () => {
  const [flags, setFlags] = useState<FlagState>({});
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const loadFlags = async () => {
      const storedFlags = await AsyncStorage.getItem("peopleFlags");
      if (storedFlags) {
        setFlags(JSON.parse(storedFlags));
      }
    };
    loadFlags();
  }, []);

  const updateSelection = async (id: number, value: string) => {
    const newFlags = { ...flags, [id]: value };
    setFlags(newFlags);
    await AsyncStorage.setItem("peopleFlags", JSON.stringify(newFlags));
  };

  // Conta il numero di persone che hanno scelto "Raduno e Cena"
  const totalSelected = Object.values(flags).filter(
    (value) => value === OPTIONS.FULL
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
 <View style={styles.container}>
  
  {/* HEADER */}
  <View style={styles.header}>
    <Text style={styles.headerText}>Nome</Text>
    <View style={styles.radioHeader}>
      <View style={styles.iconColumn}><Icon name="silverware-fork-knife" size={24} color="black" /></View>
      <View style={styles.iconColumn}><Icon name="account-group" size={24} color="black" /></View>
      <View style={styles.iconColumn}><Icon name="video" size={24} color="black" /></View>
      <View style={styles.iconColumn}><Icon name="close-circle" size={24} color="black" /></View>
    </View>
  </View>

  {/* LISTA DEI NOMI */}
  <FlatList
  data={peopleList}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.item}>
      <Text style={styles.nameColumn}>{item.name}</Text>
      <View style={styles.radioGroup}>
        {Object.entries(OPTIONS).map(([key, label]) => (
          <TouchableOpacity 
            key={key} 
            style={[
              styles.radioColumn, 
              flags[item.id] === label ? styles.radioSelected : styles.radioUnselected
            ]} 
            onPress={() => updateSelection(item.id, label)}
          >
            <RadioButton 
              value={label} 
              status={flags[item.id] === label ? "checked" : "unchecked"}
              onPress={() => updateSelection(item.id, label)}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )}
  contentContainerStyle={{ paddingBottom: 80 }} // 👈 Aggiunge spazio per non coprire il footer
/>

{/* FOOTER FIXED SOPRA LA NAVBAR */}
<View style={styles.footer}>
<TouchableOpacity onPress={() => router.push("/peopleManager")}>
  <Icon name="account-group" size={28} color="black" />
</TouchableOpacity>
  <Text style={styles.totalText}>Totale Raduno e Cena: {totalSelected}</Text>
</View>



</View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  // **HEADER (RIGA TITOLI)**
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingHorizontal: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 120, // Larghezza fissa per il nome
    textAlign: "left",
  },

  radioHeader: {
    flexDirection: "row",
  },

  iconColumn: {
    width: 50, // Stessa larghezza delle colonne dei RadioButton
    alignItems: "center",
    marginHorizontal:5
  },

  // **RIGHE CON I NOMI E I RADIO BUTTON**
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  nameColumn: {
    width: 120, // Nome con larghezza fissa
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },

  radioGroup: {
    flexDirection: "row",
  },

  radioColumn: {
    width: 50, // Stessa larghezza delle icone
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2, // Bordo sempre visibile
    borderRadius: 15, // Forma arrotondata
    padding: 5,
    marginHorizontal:5
  },

  radioUnselected: {
    borderColor: "#ccc", // Bordo grigio per i non selezionati
  },

  radioSelected: {
    borderColor: "#000", // Bordo nero per i selezionati
  },

  // **FOOTER (TOTALE)**
  footer: {
    flex: 0, // 👈 Impedisce che venga coperto dalla FlatList
    alignSelf: "stretch", // 👈 Occupa tutta la larghezza disponibile
    padding: 15,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius:5,

    borderTopWidth: 2,
    borderTopColor: "#000",
    zIndex: 10, // 👈 Mantiene il footer sopra la lista
    elevation: 5, // 👈 Migliora la visibilità su Android
  },
  
  

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PeopleScreen;
