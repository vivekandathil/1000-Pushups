import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";

import NumericInput from "react-native-numeric-input";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const list = [
  {
    name: "Default",
    subtitle:
      "Perform regular pushups and tap the screen with your nose to increment reps",
    avatar: "./assets/twoarm.png",
  },
  {
    name: "One Arm",
    subtitle:
      "Perform one arm pushups and tap the screen with your unused hand to increment reps",
    avatar: "./assets/onearm.png",
  },
];

console.disableYellowBox = true;

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);
  const [noseVisible, setNoseVisible] = React.useState(false);
  const [counterValue, setCounterValue] = React.useState(10);

  return (
    <View style={styles.container}>
      <TouchableScale
        onPress={() => {
          setCount(count + 1);
        }}
        onPressIn={() => setNoseVisible(true)}
        onPressOut={() => setNoseVisible(false)}
      >
        <AnimatedCircularProgress
          size={320}
          width={3}
          fill={(count / 1000) * 100}
          tintColor="#1aff1a"
          backgroundColor="#004d00"
        >
          {(fill) => (
            <View>
              <Text
                style={[
                  styles.circleText,
                  {
                    fontSize: 40,
                  },
                ]}
              >
                {noseVisible ? "NOSE PRESS" : count}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </TouchableScale>
      <Text style={[styles.circleText, { fontSize: 20, marginTop: 30 }]}>
        {1000 - count + " Pushups Left"}
      </Text>
      <View style={styles.addContainer}>
        <TouchableScale
          Component={TouchableScale}
          friction={90}
          tension={100}
          activeScale={0.75}
          onPress={() => {
            setCount(count + counterValue);
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              padding: 20,
              width: 190,
              height: 130,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              borderColor: "#99ff99",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "HelveticaNeue-Light",
                fontSize: 24,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {counterValue > 0 ? "Add" : "Remove"} Reps
            </Text>
            <NumericInput
              initValue={10}
              type="up-down"
              onChange={(value) => setCounterValue(value)}
              textColor="#4dff4d"
              upDownButtonsBackgroundColor="black"
              containerStyle={{ backgroundColor: "black" }}
              inputStyle={{ fontFamily: "Avenir-Light", fontSize: 27 }}
              borderColor="#4dff4d"
              iconStyle={{ color: "green" }}
              rounded
              totalHeight={60}
              totalWidth={80}
            />
          </View>
        </TouchableScale>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          onPress={() => navigation.navigate("Settings")}
          title="+"
          color="green"
        />
        <Button
          onPress={() => {
            setCount(0);
          }}
          title="o"
          color="green"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
keyExtractor = (item, index) => index.toString();
function ModalScreen({ navigation }) {
  renderItem = ({ item }) => (
    <ListItem
      containerStyle={{ width: 300 }}
      title={item.name}
      subtitle={item.subtitle}
      leftAvatar={{
        source: { uri: item.avatar },
      }}
      bottomDivider
      chevron
    />
  );
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
      }}
    >
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator headerMode={"none"}>
      <MainStack.Screen name="Home" component={HomeScreen} />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainStackScreen} />
        <RootStack.Screen name="Settings" component={ModalScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  addContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
  circleText: {
    color: "white",
    fontFamily: "Avenir-Light",
  },
});
