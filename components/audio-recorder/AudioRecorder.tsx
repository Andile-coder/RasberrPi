import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording]: any = useState();
  const [permission, setPermission] = useState(null);

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
        await recording.startAsync();
        setRecording(recording);
        setIsRecording(true);
      } catch (error) {
        console.error(error);
      }
      console.log(status);
    })();
  };
  useEffect(() => {
    console.log(isRecording);
  });

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();
      console.log("Recorded audio uri:", uri);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
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
  button: {
    marginLeft: 20,
    borderRadius: 7,
    backgroundColor: "#2E4053",
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
