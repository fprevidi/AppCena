import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { peopleList } from "../src/people";
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native"; // 👈 Importa l'hook
import { Alert } from "react-native";

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
  const [people, setPeople] = useState(peopleList); // 👈 Inizializza con `peopleList`, ma poi aggiorna
    const [showUnselectedOnly, setShowUnselectedOnly] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const loadPeople = async () => {
        const storedPeople = await AsyncStorage.getItem("peopleList");
        if (storedPeople) {
          setPeople(JSON.parse(storedPeople)); // 👈 Aggiorna lo stato con i dati salvati
        }
      };
      loadPeople();
    }, [])
  );
  
  const confirmReset = () => {
    Alert.alert(
      "Conferma Reset",
      "Sei sicuro di voler resettare tutte le selezioni?",
      [
        { text: "Annulla", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => setFlags({}) },
      ]
    );
  };
  

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

  const toggleFilter = () => {
    setShowUnselectedOnly((prev) => !prev);
  };
  

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
  data={people.filter(person => !showUnselectedOnly || !flags[person.id])} // 👈 Filtra le persone
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
  contentContainerStyle={{ paddingBottom: 80 }} 
/>

<View style={styles.footer}>
  <View style={styles.footerRow}>
    {/* ICONA GESTIONE PERSONE (SINISTRA) */}
    <TouchableOpacity onPress={() => router.push("/peopleManager")}>
      <Icon name="account-group" size={28} color="black" />
    </TouchableOpacity>

    {/* ICONA FILTRO (CENTRO) */}
    <TouchableOpacity onPress={toggleFilter}>
      <Icon name={showUnselectedOnly ? "filter-remove" : "filter"} size={28} color="blue" />
    </TouchableOpacity>

    {/* ICONA RESET RADIO (DESTRA) */}
    <TouchableOpacity onPress={() => confirmReset()}>
      <Icon name="refresh" size={28} color="red" />
    </TouchableOpacity>
  </View>

  {/* TOTALE RADUNO E CENA (SOTTO) */}
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

  footer: {
    flexDirection: "column", // 👈 Struttura a colonne
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  
  footerRow: {
    flexDirection: "row", // 👈 Allinea le icone in riga
    justifyContent: "space-between", // 👈 Una a sinistra, una a destra
    width: "100%", // 👈 Occupa tutta la larghezza
    paddingHorizontal: 20,
    marginBottom: 5, // 👈 Distanza dal totale
  },
  
  

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PeopleScreen;
