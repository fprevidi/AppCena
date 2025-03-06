import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { peopleList } from "./people";

interface FlagState {
  [key: number]: boolean;
}

const PeopleScreen: React.FC = () => {
  const [flags, setFlags] = useState<FlagState>({});

  useEffect(() => {
    const loadFlags = async () => {
      const storedFlags = await AsyncStorage.getItem("peopleFlags");
      if (storedFlags) {
        setFlags(JSON.parse(storedFlags));
      }
    };
    loadFlags();
  }, []);

  const toggleFlag = async (id: number) => {
    const newFlags = { ...flags, [id]: !flags[id] };
    setFlags(newFlags);
    await AsyncStorage.setItem("peopleFlags", JSON.stringify(newFlags));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={peopleList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Switch
              value={!!flags[item.id]}
              onValueChange={() => toggleFlag(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default PeopleScreen;
