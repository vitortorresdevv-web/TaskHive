import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.timing(opacity, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {

      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(tabs)/src/pages/login");
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splash}>
      <Animated.Image
        source={require("../../assets/images/logo.png")}
        style={[styles.logoImg, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7dc0d6",
  },

  logoImg: {
    width: 400,
    height: 400,
  },
});