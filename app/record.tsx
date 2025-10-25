// import React, { useState, useRef, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   Modal,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { Camera, useCameraPermissions } from "expo-camera";

// export default function RecordScreen() {
//   const isWeb = Platform.OS === "web";

//   // ===== DEBUG LOGS =====
//   console.log("=== RecordScreen runtime debug ===");
//   console.log("Platform.OS =", Platform.OS);
//   console.log("typeof Camera =", typeof Camera);
//   console.log("Camera keys =", Object.keys(Camera || {}));
//   console.log(
//     "Camera.Constants?.Type?.front =",
//     // @ts-ignore
//     Camera?.Constants?.Type?.front
//   );
//   console.log("Camera.Type?.front =", (Camera as any)?.Type?.front);

//   // if Camera is actually a valid React component, typeof Camera will be "function"
//   const cameraLooksValid = useMemo(() => {
//     return typeof Camera === "function";
//   }, []);

//   // camera / recording state
//   const cameraRef = useRef<Camera | null>(null);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [recording, setRecording] = useState(false);

//   // UI / modal state
//   const [showResult, setShowResult] = useState(false);
//   const [loadingAnalysis, setLoadingAnalysis] = useState(false);
//   const [emotionLabel, setEmotionLabel] = useState<string>("happy");
//   const [emotionScore, setEmotionScore] = useState<number>(0.82);

//   async function uploadAndAnalyze(uri: string) {
//     const formData = new FormData();
//     formData.append("video", {
//       // @ts-ignore: React Native FormData file object shape
//       uri,
//       name: "mood-checkin.mp4",
//       type: "video/mp4",
//     });

//     formData.append("userId", "demo-user-id");
//     formData.append("timestamp", Date.now().toString());

//     // Replace this URL with your backend endpoint later
//     const res = await fetch("https://your-api-here.com/analyze-video", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       throw new Error("Upload failed");
//     }

//     const json = await res.json();
//     return json; // expect { score, label }
//   }

//   async function startRecording() {
//     // SAFETY: if we're on web OR Camera isn't valid, just simulate
//     if (isWeb || !cameraLooksValid) {
//       setEmotionLabel("happy");
//       setEmotionScore(0.82);
//       setShowResult(true);
//       return;
//     }

//     // ask camera/mic permission
//     if (!permission || !permission.granted) {
//       const perm = await requestPermission();
//       if (!perm.granted) {
//         console.log("camera/mic not granted");
//         return;
//       }
//     }

//     try {
//       setRecording(true);
//       setLoadingAnalysis(false);

//       // record up to 60s, lowish quality for demo
//       const recPromise = cameraRef.current?.recordAsync({
//         maxDuration: 60,
//         quality: "480p",
//       });

//       if (recPromise) {
//         const videoData = await recPromise;
//         console.log("Recorded video file:", videoData?.uri);

//         try {
//           // send to backend / OpenAI
//           setLoadingAnalysis(true);

//           const analysis = await uploadAndAnalyze(videoData.uri);
//           console.log("analysis result:", analysis);

//           if (analysis?.label) setEmotionLabel(analysis.label);
//           if (analysis?.score != null) setEmotionScore(analysis.score);
//         } catch (err) {
//           console.error("AI analyze failed:", err);
//           // fallback
//           setEmotionLabel("neutral");
//           setEmotionScore(0.5);
//         } finally {
//           setLoadingAnalysis(false);
//         }

//         // open modal
//         setShowResult(true);
//       }
//     } catch (err) {
//       console.error("recording error", err);
//     } finally {
//       setRecording(false);
//     }
//   }

//   function stopRecording() {
//     if (!isWeb && cameraLooksValid) {
//       cameraRef.current?.stopRecording();
//     }
//   }

//   function RenderRecordButton() {
//     if (recording) {
//       return (
//         <TouchableOpacity
//           style={{
//             backgroundColor: "red",
//             paddingVertical: 16,
//             paddingHorizontal: 28,
//             borderRadius: 999,
//             alignSelf: "center",
//             minWidth: 140,
//             alignItems: "center",
//           }}
//           onPress={stopRecording}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontWeight: "700",
//               fontSize: 16,
//             }}
//           >
//             STOP
//           </Text>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <TouchableOpacity
//         style={{
//           backgroundColor: "white",
//           paddingVertical: 16,
//           paddingHorizontal: 28,
//           borderRadius: 999,
//           alignSelf: "center",
//           minWidth: 140,
//           alignItems: "center",
//         }}
//         onPress={startRecording}
//       >
//         <Text
//           style={{
//             color: "black",
//             fontWeight: "700",
//             fontSize: 16,
//           }}
//         >
//           {cameraLooksValid ? "REC" : "Simulate Record"}
//         </Text>
//       </TouchableOpacity>
//     );
//   }

//   function ResultModal() {
//     return (
//       <Modal visible={showResult} transparent animationType="fade">
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0,0,0,0.7)",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: 24,
//               borderRadius: 16,
//               width: 280,
//               alignItems: "center",
//             }}
//           >
//             {loadingAnalysis ? (
//               <>
//                 <Text
//                   style={{
//                     fontSize: 18,
//                     fontWeight: "600",
//                     marginBottom: 12,
//                     textAlign: "center",
//                   }}
//                 >
//                   Analyzing your mood...
//                 </Text>
//                 <ActivityIndicator size="large" color="#5A8DEE" />
//               </>
//             ) : (
//               <>
//                 <Text
//                   style={{
//                     fontSize: 20,
//                     fontWeight: "600",
//                     marginBottom: 8,
//                   }}
//                 >
//                   Today’s Emotion
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: "#333",
//                     marginBottom: 20,
//                     textAlign: "center",
//                   }}
//                 >
//                   You seem {Math.round(emotionScore * 100)}% {emotionLabel} today
//                   😄
//                 </Text>

//                 <TouchableOpacity
//                   onPress={() => setShowResult(false)}
//                   style={{
//                     backgroundColor: "#5A8DEE",
//                     paddingVertical: 10,
//                     paddingHorizontal: 20,
//                     borderRadius: 8,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "white",
//                       fontWeight: "600",
//                     }}
//                   >
//                     OK
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   //
//   // 1. FALLBACK VIEW (no camera native module / web / Expo Go mismatch)
//   //
//   if (!cameraLooksValid) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "black",
//           padding: 24,
//           justifyContent: "center",
//         }}
//       >
//         <ScrollView
//           style={{ maxHeight: "60%" }}
//           contentContainerStyle={{ alignItems: "center" }}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontSize: 20,
//               fontWeight: "600",
//               textAlign: "center",
//               marginBottom: 16,
//             }}
//           >
//             Camera module not ready
//           </Text>

//           <Text
//             style={{
//               color: "white",
//               fontSize: 14,
//               textAlign: "center",
//               marginBottom: 24,
//             }}
//           >
//             Phronesis couldn't load the camera on this build.
//             We'll still simulate mood scoring so you can keep demoing.
//           </Text>

//           <Text
//             style={{
//               color: "#aaa",
//               fontSize: 12,
//               textAlign: "left",
//               width: "100%",
//               marginBottom: 12,
//             }}
//           >
//             Platform.OS = {Platform.OS}
//           </Text>

//           <Text
//             style={{
//               color: "#aaa",
//               fontSize: 12,
//               textAlign: "left",
//               width: "100%",
//               marginBottom: 12,
//             }}
//           >
//             typeof Camera = {String(typeof Camera)}
//           </Text>

//           <Text
//             style={{
//               color: "#aaa",
//               fontSize: 12,
//               textAlign: "left",
//               width: "100%",
//               marginBottom: 12,
//             }}
//           >
//             Keys on Camera: {JSON.stringify(Object.keys(Camera || {}), null, 2)}
//           </Text>

//           <Text
//             style={{
//               color: "#aaa",
//               fontSize: 12,
//               textAlign: "left",
//               width: "100%",
//               marginBottom: 12,
//             }}
//           >
//             Camera.Constants?.Type?.front ={" "}
//             {String(
//               // @ts-ignore
//               Camera?.Constants?.Type?.front
//             )}
//           </Text>

//           <Text
//             style={{
//               color: "#aaa",
//               fontSize: 12,
//               textAlign: "left",
//               width: "100%",
//               marginBottom: 24,
//             }}
//           >
//             Camera.Type?.front = {String((Camera as any)?.Type?.front)}
//           </Text>
//         </ScrollView>

//         <RenderRecordButton />

//         <ResultModal />
//       </View>
//     );
//   }

//   //
//   // 2. REAL CAMERA VIEW (cameraLooksValid === true)
//   //
//   return (
//     <View style={{ flex: 1, backgroundColor: "black" }}>
//       <Camera
//         ref={cameraRef}
//         style={{ flex: 1 }}
//         type={
//           (Camera as any).Constants?.Type?.front ??
//           (Camera as any).Type?.front
//         }
//         ratio="16:9"
//       >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "flex-end",
//             padding: 24,
//             backgroundColor: "rgba(0,0,0,0.2)",
//           }}
//         >
//           <Text
//             style={{
//               color: "white",
//               textAlign: "center",
//               marginBottom: 12,
//               fontSize: 16,
//               fontWeight: "500",
//             }}
//           >
//             How was your day?
//           </Text>

//           <RenderRecordButton />
//         </View>
//       </Camera>

//       <ResultModal />
//     </View>
//   );
// }
