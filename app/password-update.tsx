import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PasswordUpdateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Update</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default PasswordUpdateScreen;
