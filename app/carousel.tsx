import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// Brain/Mind Icon
function MindIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 12 20 C 7.59 20 4 16.41 4 12 C 4 7.59 7.59 4 12 4 C 16.41 4 20 7.59 20 12 C 20 16.41 16.41 20 12 20 Z"
        fill="#1a1a1a"
      />
      <Circle cx="8.5" cy="10" r="1.5" fill="#1a1a1a" />
      <Circle cx="15.5" cy="10" r="1.5" fill="#1a1a1a" />
      <Path
        d="M 12 17 C 14 17 15.5 15.5 15.5 14 L 8.5 14 C 8.5 15.5 10 17 12 17 Z"
        fill="#1a1a1a"
      />
    </Svg>
  );
}

// Recording Icon
function RecordingIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" fill="#1a1a1a" />
      <Path
        d="M 23 7 L 16 12 L 23 17 V 7 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="#1a1a1a"
      />
      <Path
        d="M 15 5 H 3 C 1.89543 5 1 5.89543 1 7 V 17 C 1 18.1046 1.89543 19 3 19 H 15 C 16.1046 19 17 18.1046 17 17 V 7 C 17 5.89543 16.1046 5 15 5 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Chart/Progress Icon
function ChartIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 3 V 21 H 21"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 7 16 L 12 11 L 16 15 L 21 8"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="7" cy="16" r="2" fill="#1a1a1a" />
      <Circle cx="12" cy="11" r="2" fill="#1a1a1a" />
      <Circle cx="16" cy="15" r="2" fill="#1a1a1a" />
      <Circle cx="21" cy="8" r="2" fill="#1a1a1a" />
    </Svg>
  );
}

const slides = [
  {
    id: "1",
    icon: <MindIcon />,
    title: "Your Journey to\nSelf-Knowledge",
    description:
      "Phronesis helps you understand yourself better through daily reflection and insight.",
  },
  {
    id: "2",
    icon: <RecordingIcon />,
    title: "Daily Insights\nMade Simple",
    description:
      "Record your thoughts, feelings, and experiences in just seconds each day.",
  },
  {
    id: "3",
    icon: <ChartIcon />,
    title: "Track Your\nProgress",
    description:
      "Watch your emotional patterns emerge and celebrate your personal growth.",
  },
];

export default function CarouselScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    router.push("/login" as any);
  };

  const renderItem = ({ item, index }: { item: typeof slides[0]; index: number }) => {
    const isLast = index === slides.length - 1;

    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconContainer}>{item.icon}</View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {isLast && (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  iconContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 24,
  },
  buttonText: {
    color: "#faefde",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5DCC8",
  },
  dotActive: {
    backgroundColor: "#1a1a1a",
    width: 32,
  },
});
