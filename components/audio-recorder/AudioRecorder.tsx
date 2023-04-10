import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";

import { Button, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Sound from "react-native-sound";
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording]: any = useState();

  const startRecording = async () => {
    (async () => {
      let { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      try {
        const recording = new Audio.Recording();

        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recording._options?.isMeteringEnabled;
        recording.setOnRecordingStatusUpdate((status) => {
          const scaledValue = (Number(status?.metering) + 160) / 160;
          publishData(scaledValue);
          console.log(scaledValue);
        });
        await recording.startAsync();
        setRecording(recording);
        setIsRecording(true);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const publishData = (file: any): void => {
    fetch("https://api.thingspeak.com/update.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: "Y80489TWQBVWE9JH",
        field1: file,
        field2: 0,
        field3: 0,
        field4: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error sending data to ThingSpeak:", error);
      });
  };

  return (
    <View>
      <TouchableOpacity
        style={isRecording ? styles.buttonStop : styles.buttonStart}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStart: {
    marginLeft: 20,
    borderRadius: 7,
    backgroundColor: "#2E4053",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 120,
  },
  buttonStop: {
    marginLeft: 20,
    borderRadius: 7,
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 120,
  },
  buttonText: {
    color: "#E8FCEA",
    fontSize: 15,
  },
});

export default AudioRecorder;
