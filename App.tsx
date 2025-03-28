import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PeopleScreen from "./app/index";

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Elenco Persone" component={PeopleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
