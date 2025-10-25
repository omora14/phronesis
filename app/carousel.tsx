import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    title: "Your Journey to Self-Knowledge",
    description:
      "Phronesis is your personal companion for understanding yourself. Capture daily moments, reflect on your experiences, and gain clarity on your emotions and habits.\n\nBy building a record of your days, you’ll uncover patterns, celebrate small victories, and develop a deeper awareness of what drives your growth and happiness.",
  },
  {
    key: "slide2",
    title: "Daily Insights Made Simple",
    description:
      "With Phronesis, recording your day takes just a few seconds. Use short videos or audio entries to document your mood, thoughts, and experiences.\n\nOver time, these recordings provide insights into your emotional patterns, helping you make intentional choices, track progress, and cultivate habits that support your well-being.",
  },
  {
    key: "slide3",
    title: "Track Your Progress",
    description:
      "Review your past week, explore trends in your moods, and see how you evolve over time. Every recording contributes to a clearer picture of your personal journey.\n\nPhronesis turns daily reflection into meaningful insights. Start today and take the first step toward understanding yourself and unlocking your full potential.",
    isLast: true,
  },
];

export default function CarouselScreen() {
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (carouselRef.current) {
      const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
      carouselRef.current.scrollTo({ index: nextIndex, animated: true });
    }
  };

  const handleStartJourney = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome to Phronesis</Text>
      </View>

      {/* Carousel */}
      <Carousel
        loop={false}
        width={width}
        height={400}
        autoPlay={false}
        ref={carouselRef}
        data={slides}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {!item.isLast ? (
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleStartJourney}>
                <Text style={styles.buttonText}>Start Your Journey</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  headerContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  headerText: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  slide: {
    width: width - 60,
    marginHorizontal: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 15, textAlign: "center" },
  description: { fontSize: 16, textAlign: "center", marginBottom: 25 },
  button: {
    backgroundColor: "#5A8DEE",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
