import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Header from "./components/header/Header";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AudioRecorder from "./components/audio-recorder/AudioRecorder";
export default function App() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [errorMsg, setErrorMsg] = useState(null);
  const [pin, setPin] = useState({
    latitude: 0,
    longitude: 0,
  });
  const updateLocation = (): void => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
    })();
  };
  //we assume the application varifys the users location to be in one of the locations
  //for demo purposes we are not concerned about this aspect
  const publishData = (): void => {
    fetch("https://api.thingspeak.com/update.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: "Y80489TWQBVWE9JH",
        field1: "26",
        field2: "25",
        // add more fields if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data sent to ThingSpeak:", data);
      })
      .catch((error) => {
        console.error("Error sending data to ThingSpeak:", error);
      });
  };
  const startRecord = (): void => {};
  useEffect(() => {
    updateLocation();
  }, []);
  return (
    <View style={styles.container}>
      <Header />
      {/* <ScrollView style={styles.scrollView}> */}
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -33.9333296,
            longitude: 18.6333308,
            latitudeDelta: 0.005,
            longitudeDelta: 0.0005,
          }}
        >
          <Marker
            title="location title"
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          ></Marker>
        </MapView>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={updateLocation}>
            <Text style={styles.buttonText}>Update Location</Text>
          </TouchableOpacity>
          <AudioRecorder />

          <TouchableOpacity style={styles.button} onPress={publishData}>
            <Text style={styles.buttonText}>Publish Data</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: "#fff",
  },

  scrollView: {
    height: 100,
  },
  map: {
    width: "80%",
    height: "70%",
    margin: 20,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
  },
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
