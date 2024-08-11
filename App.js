import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";

import messaging from "@react-native-firebase/messaging";

import { useEffect } from "react";
export default function App() {
  async function requestUserPermission() {
    const authStatus = await FirebaseMessagingTypes().requestPermission();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }

    useEffect(() => {
      if (requestUserPermission()) {
        messaging()
          .getToken()
          .then((token) => console.log(token));
      } else {
        console.log("user permission failed", authStatus);
      }

      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          console.log(remoteMessage?.notification);
        });

      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(remoteMessage.notification);
      });

      // Register background handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
      });

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert(
          "A new FCM message arrived!",
          JSON.stringify(remoteMessage)
        );
      });

      return unsubscribe;
    }, []);
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
