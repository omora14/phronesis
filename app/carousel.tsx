import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Svg, { Circle, Path, Polyline, Rect } from "react-native-svg";
 
const { width, height } = Dimensions.get("window");
 
const slides = [
  {
    key: "slide1",
    title: "UNDERSTAND YOUR\nEMOTIONS",
    description: "Our AI analyzes your videos to track\nyour mood and well-being",
    icon: "emotions",
  },
  {
    key: "slide2",
    title: "TRACK YOUR\nPROGRESS",
    description: "See patterns and insights from your\ndaily emotional check-ins",
    icon: "progress",
  },
  {
    key: "slide3",
    title: "BUILD BETTER\nHABITS",
    description: "Use insights to improve your mental\nhealth and daily routines",
    icon: "habits",
    isLast: true,
  },
];
 
// Icon components
function LogoIcon() {
  return (
    <Svg width="100" height="100" viewBox="0 0 120 120">
      <Path
        d="M 60 30 C 60 30, 72 32, 78 42 C 83 50, 85 62, 83 75 C 82 80, 80 85, 78 88 L 72 95 L 48 95 C 48 95, 45 91, 43 87 C 39 77, 37 65, 39 52 C 41 40, 47 33, 55 31 C 57 30, 60 30, 60 30 Z"
        stroke="#1a1a1a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="50"
        y="52"
        width="22"
        height="22"
        rx="3"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
      />
      <Path
        d="M 58 60 L 58 68 L 65 64 Z"
        fill="#1a1a1a"
      />
    </Svg>
  );
}
 
function EmotionsIcon() {
  return (
    <Svg width="140" height="140" viewBox="0 0 140 140">
      {/* Heart shape */}
      <Path
        d="M 70 110 C 70 110, 35 85, 35 60 C 35 45, 45 35, 55 35 C 62 35, 67 40, 70 45 C 73 40, 78 35, 85 35 C 95 35, 105 45, 105 60 C 105 85, 70 110, 70 110 Z"
        stroke="#1a1a1a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trend line inside heart */}
      <Circle cx="50" cy="70" r="3" fill="#1a1a1a" />
      <Circle cx="62" cy="63" r="3" fill="#1a1a1a" />
      <Circle cx="75" cy="55" r="3" fill="#1a1a1a" />
      <Circle cx="88" cy="48" r="3" fill="#1a1a1a" />
      <Polyline
        points="50,70 62,63 75,55 88,48"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow */}
      <Path
        d="M 85 51 L 88 48 L 88 54 M 88 48 L 82 48"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
function ProgressIcon() {
  return (
    <Svg width="140" height="140" viewBox="0 0 140 140">
      {/* Bar chart */}
      <Rect x="30" y="80" width="15" height="40" rx="3" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      <Rect x="52" y="60" width="15" height="60" rx="3" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      <Rect x="74" y="45" width="15" height="75" rx="3" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      <Rect x="96" y="30" width="15" height="90" rx="3" stroke="#1a1a1a" strokeWidth="3" fill="none" />
    </Svg>
  );
}
 
function HabitsIcon() {
  return (
    <Svg width="140" height="140" viewBox="0 0 140 140">
      {/* Calendar/checklist */}
      <Rect x="35" y="40" width="70" height="70" rx="8" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      {/* Checkmark 1 */}
      <Path d="M 45 60 L 52 67 L 65 54" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Checkmark 2 */}
      <Path d="M 45 80 L 52 87 L 65 74" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Line 3 */}
      <Path d="M 45 95 L 95 95" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
 
export default function CarouselScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
 
  const handleGetStarted = () => {
    router.push("/login");
  };
 
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "emotions":
        return <EmotionsIcon />;
      case "progress":
        return <ProgressIcon />;
      case "habits":
        return <HabitsIcon />;
      default:
        return null;
    }
  };
 
  return (
    <View style={styles.container}>
      {/* Carousel */}
      <View style={styles.carouselWrapper}>
        <Carousel
          loop={false}
          width={width}
          height={height * 0.65}
          autoPlay={false}
          data={slides}
          scrollAnimationDuration={400}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconContainer}>
                {renderIcon(item.icon)}
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
 
      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
 
      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.skipButton} onPress={handleGetStarted}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
    alignItems: "center",
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: "#1a1a1a",
  },
  inactiveDot: {
    backgroundColor: "#D0C7B3",
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: 40,
    paddingBottom: 80,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#FDF8EB",
    fontSize: 18,
    fontWeight: "700",
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },
});
 