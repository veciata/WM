import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { scanFaces } from 'react-native-vision-camera-face-detector';

const { width, height } = Dimensions.get('window');

const steps = [
  'Kameraya bakın',
  'Başınızı sağa çevirin',
  'Başınızı sola çevirin'
];

const LivenessTest = () => {
  const [visible, setVisible] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const camera = useRef<Camera>(null);

  const devices = useCameraDevices();
  const frontDevice = devices.front;

  const requestPermissions = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
      setPermissionGranted(cameraPermission === 'granted');

      if (cameraPermission !== 'granted') {
        setErrorMessage("Kamera izni verilmedi");
        setHasError(true);
      }
    } catch (error) {
      setErrorMessage(`Kamera hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      setHasError(true);
      setPermissionGranted(false);
    }
  };

  useEffect(() => {
    if (visible) {
      requestPermissions();
    }
  }, [visible]);

  const onFaceDetected = (face: any) => {
    if (!face) return;

    const yawAngle = face.yaw ?? face.headEulerAngleY ?? 0;

    if (yawAngle < -35) {
      if (stepIndex === 1) setStepIndex(2);
    } else if (yawAngle > 35) {
      if (stepIndex === 0) setStepIndex(1);
    }
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const faces = scanFaces(frame);
      if (faces.length > 0) {
        runOnJS(onFaceDetected)(faces[0]);
      }
    } catch { }
  }, [stepIndex]);

  const closeModal = () => {
    setVisible(false);
    setStepIndex(0);
    setHasError(false);
    setErrorMessage('');
  };

  if (!frontDevice) return null;

  return (
    <>
      {!visible && (
        <TouchableOpacity
          style={styles.launchButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.buttonText}>Liveness Testi Başlat</Text>
        </TouchableOpacity>
      )}

      {visible && (
        <View style={styles.fullScreen}>
          {hasError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                {errorMessage || 'Kamera ile ilgili bir hata oluştu'}
              </Text>
            </View>
          ) : permissionGranted ? (
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={frontDevice}
              isActive={visible}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : (
            <View style={styles.center}>
              <Text style={styles.permissionText}>
                Kamera izni gerekiyor
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermissions}
              >
                <Text style={styles.buttonText}>İzin Ver</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.overlay}>
            <Text style={styles.instruction}>{steps[stepIndex]}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#000',
    zIndex: 999,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instruction: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  launchButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
});

export default LivenessTest;
