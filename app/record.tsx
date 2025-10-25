// import React, { useState, useRef } from "react";
// import { View, Text, TouchableOpacity, Alert } from "react-native";
// import { Camera, useCameraPermissions, CameraRecordingOptions } from "expo-camera";

// export default function RecordScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [recording, setRecording] = useState(false);

//   // in TS, we can just say: useRef<Camera | null>(null) but Camera's type defs are weird in web.
//   // Easiest hack for Expo Router/Web dev: use 'any'.
//   const cameraRef = useRef<any>(null);

//   async function startRecording() {
//     // ask permission if not granted
//     if (!permission || !permission.granted) {
//       const perm = await requestPermission();
//       if (!perm.granted) {
//         Alert.alert("Camera access is required.");
//         return;
//       }
//     }

//     setRecording(true);

//     // recording options
//     const options: CameraRecordingOptions = {
//       maxDuration: 60,
//       quality: "480p",
//     };

//     // start recording
//     const videoPromise = cameraRef.current?.recordAsync(options);

//     // wait for the recording to finish (user will press STOP)
//     if (videoPromise) {
//       const video = await videoPromise;
//       console.log("video file:", video?.uri);

//       Alert.alert(
//         "Today's Emotion",
//         "You seem 82% happy today 😄",
//         [{ text: "OK" }]
//       );
//     }

//     setRecording(false);
//   }

//   function stopRecording() {
//     cameraRef.current?.stopRecording();
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "black" }}>
//       <Camera
//         ref={cameraRef}
//         style={{ flex: 1 }}
//         type="front" // instead of CameraType.front
//       >
//         <View style={{ flex: 1, justifyContent: "flex-end", padding: 24 }}>
//           <Text
//             style={{
//               color: "white",
//               textAlign: "center",
//               marginBottom: 12,
//               fontSize: 16,
//             }}
//           >
//             How was your day?
//           </Text>

//           {recording ? (
//             <TouchableOpacity
//               style={{
//                 backgroundColor: "red",
//                 padding: 16,
//                 borderRadius: 50,
//                 alignSelf: "center",
//                 width: 90,
//                 alignItems: "center",
//               }}
//               onPress={stopRecording}
//             >
//               <Text style={{ color: "white", fontWeight: "600" }}>STOP</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={{
//                 backgroundColor: "white",
//                 padding: 16,
//                 borderRadius: 50,
//                 alignSelf: "center",
//                 width: 90,
//                 alignItems: "center",
//               }}
//               onPress={startRecording}
//             >
//               <Text style={{ color: "black", fontWeight: "600" }}>REC</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </Camera>
//     </View>
//   );
// }
