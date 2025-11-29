import { Animated, Easing } from "react-native";

export const fadeIn = (duration = 350) => {
  const opacity = new Animated.Value(0);

  Animated.timing(opacity, {
    toValue: 1,
    duration,
    useNativeDriver: true,
    easing: Easing.out(Easing.exp),
  }).start();

  return { opacity };
};

export const slideUp = (duration = 350, distance = 20) => {
  const translateY = new Animated.Value(distance);

  Animated.timing(translateY, {
    toValue: 0,
    duration,
    useNativeDriver: true,
    easing: Easing.out(Easing.exp),
  }).start();

  return { transform: [{ translateY }] };
};
