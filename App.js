import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
  Image,
} from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ListItem, CheckBox, Divider, Overlay } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import NumericInput from "react-native-numeric-input";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Speech from "expo-speech";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import NumberPlease from "react-native-number-please";
import { LinearGradient } from "expo-linear-gradient";
import { CountDown } from "react-native-customizable-countdown";
import NumericTimer from "./components/NumericTimer.js";
import { Accelerometer } from 'expo-sensors';

const list = [
  {
    name: "Regular",
    subtitle:
      "Perform regular pushups and tap the screen with your nose to increment.",
  },
  {
    name: "One Arm",
    subtitle: "Perform pushups with one arm and increment with your unused arm",
  },
  {
    name: "Pseudo-Planche",
    subtitle:
      "Perform pushups with your hands close to your waist and leaning forward. Tap the screen with your nose to increment",
  },
  {
    name: "Diamond",
    subtitle:
      "Perform pushups with your hands together in a diamond shape behind your device. Increment with your nose.",
  },
];

let speechChecked = false;
let goalPushups = 100;
let countdownDuration = [
  { id: "hour", value: 0 },
  { id: "minute", value: 10 },
  { id: "second", value: 0 },
];

console.disableYellowBox = true;

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);
  const [noseVisible, setNoseVisible] = React.useState(false);
  const [counterValue, setCounterValue] = React.useState(10);
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [touchingButton, setTouchingButton] = React.useState(false);
  const [duration, setDuration] = React.useState(100);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 26,
          marginTop: 20,
          width: 500,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setOverlayVisible(true);
            setTouchingButton(false);
          }}
        >
          <Ionicons name="ios-water" size={32} color="#4dff4d" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="ios-settings" size={32} color="#4dff4d" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Warning",
              "Are you sure you want to clear your progress?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Yes", onPress: () => setCount(0) },
              ],
              { cancelable: false }
            );
          }}
        >
          <Ionicons name="ios-refresh" size={32} color="#4dff4d" />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ backgroundColor: "#001a00" }}
      >
        <View style={{ height: "90%", width: 300, alignItems: "center" }}>
          <Text
            style={{
              color: "white",
              fontFamily: "Avenir-Light",
              textAlign: "center",
              margin: 60,
            }}
          >
            Is your screen getting sweaty?{"\n\n"}You can now clean it without
            messing anything up.
          </Text>
          <TouchableScale
            onPressIn={() => {
              setTouchingButton(true);
            }}
            onPressOut={() => {
              setTouchingButton(false);
            }}
          >
            <CountdownCircleTimer
              isPlaying={touchingButton}
              duration={3}
              colors={[["#4dff4d", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
              onComplete={() => {
                setOverlayVisible(false);
              }}
            >
              {({ remainingTime, animatedColor }) => (
                <Animated.Text style={{ color: animatedColor }}>
                  {touchingButton ? remainingTime : "RESUME"}
                </Animated.Text>
              )}
            </CountdownCircleTimer>
          </TouchableScale>
        </View>
      </Overlay>

      <TouchableScale
        onPress={() => {
          setCount(count + 1);
          if (count % 10 == 0 && speechChecked) {
            Speech.speak(
              (goalPushups - count - 1).toString() + " push ups to go"
            );
          }
        }}
        onPressIn={() => setNoseVisible(true)}
        onPressOut={() => setNoseVisible(false)}
      >
        <AnimatedCircularProgress
          size={320}
          width={3}
          fill={(count / goalPushups) * 100}
          tintColor="#1aff1a"
          backgroundColor="#004d00"
        >
          {(fill) => (
            <View>
              <CountdownCircleTimer
                isPlaying={!overlayVisible}
                duration={
                  countdownDuration[0].value * 3600 +
                  countdownDuration[1].value * 60 +
                  countdownDuration[2].value
                }
                trailColor={"#333333"}
                colors={[["#66ff66", 0.33], ["#ccff33", 0.33], ["#A30000"]]}
                size={300}
                strokeWidth={10}
              >
                {({ remainingTime, animatedColor }) => (
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
                )}
              </CountdownCircleTimer>
            </View>
          )}
        </AnimatedCircularProgress>
      </TouchableScale>
      <NumericTimer countdown={countdownDuration[0].value * 3600 +
        countdownDuration[1].value * 60 +
        countdownDuration[2].value} isCounting={!overlayVisible} />
      <Text style={[styles.circleText, { fontSize: 20, marginTop: 10 }]}>
        {goalPushups - count + " Pushups Left"}
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
              {counterValue > 0 ? "Add" : "Remove"} a Set
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
      <StatusBar hidden />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  const initialTime = [
    { id: "hour", value: 0 },
    { id: "minute", value: 10 },
    { id: "second", value: 0 },
  ];

  const [time, setTime] = useState(initialTime);
  const [starting, setStarting] = useState(false);

  const countdown = [
    { id: "hour", label: "", min: 0, max: 24 },
    { id: "minute", label: "", min: 0, max: 60 },
    { id: "second", label: "", min: 0, max: 60 },
  ];

  const renderItem = ({ item }) => (
    <TouchableScale>
      <ListItem
        containerStyle={{ width: 333 }}
        title={item.name}
        titleStyle={{ fontFamily: "HelveticaNeue" }}
        subtitle={item.subtitle}
        subtitleStyle={{ fontFamily: "HelveticaNeue-Light" }}
        leftAvatar={{
          source:
            item.name == "One Arm"
              ? require("./assets/onearm.png")
              : require("./assets/twoarm.png"),
        }}
        bottomDivider
        chevron
      />
    </TouchableScale>
  );

  return (
    <View
      style={{
        alignItems: "center",
        height: "100%",
      }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["white", "#E2E2E2"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <View
        style={{
          height: 180,
          borderRadius: 10,
          borderColor: "#38ef7d",
          borderWidth: 2,
          alignItems: "center",
          width: "90%",
          backgroundColor: "white",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {starting ? (
          <Text
            style={{
              fontFamily: "Helvetica",
              fontSize: 24,
              textAlign: "left",
              marginTop: 16,
            }}
          >
            Get Ready!
          </Text>
        ) : (
            <Ionicons
              name="ios-timer"
              size={32}
              color="#38ef7d"
              style={{ marginTop: 16 }}
            />
          )}
        <Text
          style={{
            fontFamily: "HelveticaNeue-Light",
            fontSize: 20,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {time[0].value} hours, {time[1].value} minutes, {time[2].value}{" "}
          seconds
        </Text>
        <NumberPlease
          digits={countdown}
          values={time}
          onChange={(values) => {
            setTime(values);
            countdownDuration = values;
          }}
          pickerStyle={{
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: "transparent",
            borderWidth: 1,
            height: 90,
          }}
          itemStyle={{ height: 90 }}
        />
      </View>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
        style={{
          height: 120,
          borderRadius: 10,
          borderColor: "#11998e",
          borderWidth: 2,
          width: "90%",
        }}
      />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            width: 160,
            height: 130,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            borderColor: "#38ef7d",
            borderWidth: 2,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "HelveticaNeue-Light",
              fontSize: 20,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Goal Pushups
          </Text>
          <NumericInput
            initValue={10}
            onChange={(value) => {
              goalPushups = value;
            }}
            type="up-down"
            textColor="black"
            inputStyle={{ fontFamily: "Helvetica", fontSize: 25 }}
            borderColor="#11998e"
            iconStyle={{ color: "green" }}
            rounded
            totalHeight={60}
            totalWidth={110}
          />
        </View>
        <TouchableScale
          onPress={() => {
            setStarting(true);
          }}
          style={{ margin: 20 }}
        >
          <CountdownCircleTimer
            isPlaying={starting}
            duration={3}
            colors={[
              ["#11998e", 0.33],
              ["#38ef7d", 0.33],
            ]}
            onComplete={() => {
              countdownDuration = time;
              navigation.navigate("Home");
            }}
            size={140}
            isLinearGradient
          >
            {({ remainingTime, animatedColor }) => (
              <Animated.Text style={{ color: animatedColor }}>
                {starting ? remainingTime : "START"}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
        </TouchableScale>
      </View>
    </View>
  );
}

const keyExtractor = (item, index) => index.toString();

function ModalScreen({ navigation }) {
  const [data, setData] = useState({});
  const [_subscription, setSubscription] = React.useState(null);
  const [pullups, setPullups] = React.useState(0);

  React.useEffect(() => {
    _toggle();
  }, []);

  React.useEffect(() => {
    return () => {
      _unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (Math.abs(data.z) < 0.2) {
      setPullups(pullups + 1);
    }
  }, [data])

  const _toggle = () => {
    if (_subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      Accelerometer.setUpdateInterval(100);
    }));
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    setSubscription(null);
  };

  let { x, y, z } = data;

  return (
    <View >
      <Text >Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text >
        x: {round(x)} y: {round(y)} z: {round(z)}
      </Text>
      <View >
        <TouchableOpacity onPress={_toggle} style={{ height: 300, width: 500 }}>
          <Text style={{ fontSize: 40 }}>Toggle</Text>
          <Text>{pullups}</Text>
        </TouchableOpacity>
      </View>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}


function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator headerMode={"none"}>
      <MainStack.Screen name="Details" component={DetailsScreen} />
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
    backgroundColor: "#0d0d0d",
    alignItems: "center",
  },
  addContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  circleText: {
    color: "white",
    fontFamily: "Avenir-Light",
  },
});
