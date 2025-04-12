// LivenessTest.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  CameraDevice,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import { scanFaces, Face } from "react-native-vision-camera-face-detector";

const { width, height } = Dimensions.get("window");

const steps = [
  "Kameraya bakın",
  "Başınızı sağa çevirin",
  "Başınızı sola çevirin",
];

interface LivenessTestProps {
  onSuccess: (photoUri: string) => void;
  onError: (error: Error) => void;
  onClose?: () => void;
}

const LivenessTest: React.FC<LivenessTestProps> = ({
  onSuccess,
  onError,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const camera = useRef<Camera>(null);

  const devices = useCameraDevices();

  // Robust camera device selection
  const frontDevice = useMemo<CameraDevice | null>(() => {
    if (!devices) return null;

    // 1. Try to find by position
    const byPosition = Object.values(devices).find(
      (d) => d.position === "front",
    );
    if (byPosition) return byPosition;

    // 2. Try to find by name
    const byName = Object.values(devices).find((d) =>
      d.name.toLowerCase().includes("front"),
    );
    if (byName) return byName;

    // 3. Fallback to first available device
    return Object.values(devices)[0] || null;
  }, [devices]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const permission = await Camera.requestCameraPermission();
        if (permission !== "granted") {
          throw new Error("Camera permission not granted");
        }
        setPermissionGranted(true);

        if (!frontDevice) {
          throw new Error("No suitable camera found");
        }

        setIsInitializing(false);
      } catch (error) {
        setErrorMessage(error.message);
        setHasError(true);
        setIsInitializing(false);
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    if (visible) {
      initialize();
    }
  }, [visible, frontDevice, onError]);

  const startLivenessTest = useCallback(() => {
    setVisible(true);
    setStepIndex(0);
    setHasError(false);
    setErrorMessage("");
  }, []);

  const onFaceDetected = useCallback(
    (face: Face) => {
      if (!face) return;

      try {
        const yawAngle = face.yawAngle ?? face.headEulerAngleY ?? 0;

        if (yawAngle < -35 && stepIndex === 1) {
          setStepIndex(2);
        } else if (yawAngle > 35 && stepIndex === 0) {
          setStepIndex(1);
        }
      } catch (error) {
        console.warn("Face detection processing error:", error);
      }
    },
    [stepIndex],
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      try {
        const faces = scanFaces(frame);
        if (faces.length > 0) {
          runOnJS(onFaceDetected)(faces[0]);
        }
      } catch (error) {
        console.error("Frame processor error:", error);
      }
    },
    [onFaceDetected],
  );

  const capturePhoto = useCallback(async () => {
    if (!camera.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: "quality",
        skipMetadata: true,
      });
      onSuccess(photo.path);
    } catch (error) {
      onError(
        error instanceof Error ? error : new Error("Photo capture failed"),
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onSuccess, onError]);

  useEffect(() => {
    if (stepIndex === 2) {
      capturePhoto();
    }
  }, [stepIndex, capturePhoto]);

  const closeModal = useCallback(() => {
    setVisible(false);
    setStepIndex(0);
    setHasError(false);
    setErrorMessage("");
    onClose?.();
  }, [onClose]);

  if (!visible) {
    return (
      <TouchableOpacity style={styles.launchButton} onPress={startLivenessTest}>
        <Text style={styles.buttonText}>Liveness Testi Başlat</Text>
      </TouchableOpacity>
    );
  }

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Kamera başlatılıyor...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={closeModal}>
          <Text style={styles.buttonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!frontDevice) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Kamera bulunamadı</Text>
        <TouchableOpacity style={styles.button} onPress={closeModal}>
          <Text style={styles.buttonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={frontDevice}
        isActive={visible}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={true}
        orientation="portrait"
      />

      {/* Overlay with instructions */}
      <View style={styles.overlay}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{steps[stepIndex]}</Text>
        </View>

        {isProcessing && (
          <View style={styles.processingIndicator}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.buttonText}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  launchButton: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignSelf: "center",
  },
  button: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  processingIndicator: {
    marginTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
});

export default React.memo(LivenessTest);
