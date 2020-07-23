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

function NumericTimer(props) {
    const [count, setCount] = React.useState(props.countdown)

    const formatTime = () => {
        let duration = count;
        let hours = duration / 3600;
        duration = duration % (3600);

        let min = parseInt(duration / 60);
        duration = duration % (60);

        let sec = parseInt(duration);

        if (sec < 10) {
            sec = `0${sec}`;
        }
        if (min < 10) {
            min = `0${min}`;
        }
        if (parseInt(hours, 10) > 0) {
            return (`${parseInt(hours, 10)}:${min}:${sec}`)
        }
        return (`${min}:${sec}`)
    };

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(props.isCounting ? count => count - 1 : count => count);
        }, 1000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <View ><Text style={{
            color: 'white', fontFamily: "HelveticaNeue-Light", fontSize: 40, color: '#66ff66', textShadowColor: 'rgba(0, 255, 0, 0.75)',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
            height: 45,
            width: 200,
            textAlign: 'center',
            marginTop: 8
        }}>{formatTime()}</Text></View>
    )
}

export default NumericTimer;