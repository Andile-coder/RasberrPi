import React from "react-native";
import { StyleSheet, Text, View } from "react-native";
const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titeText}>Rasberry Pi</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2E4053",
    alignItems: "center",
    height: 100,
    justifyContent: "center",
  },
  titeText: {
    color: "#E8FCEA",
  },
});
export default Header;
