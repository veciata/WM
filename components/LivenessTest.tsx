import { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native'
import { Camera } from 'expo-camera'
import * as FaceDetector from 'expo-face-detector'

type CameraRef = React.ComponentRef<typeof Camera>



type FaceDetectionResult = {
  faces: Array<{
    yawAngle: number
  }>
}

const { width } = Dimensions.get('window')

const steps = [
  'Kameraya bakın',
  'Başınızı sağa çevirin',
  'Başınızı sola çevirin'
]

const LivenessTest: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const cameraRef = useRef<CameraRef>(null)

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setPermissionGranted(status === 'granted')
  }

  useEffect(() => {
    if (visible) {
      requestPermissions()
    }
  }, [visible])

  const onFacesDetected = ({ faces }: FaceDetectionResult) => {
    if (faces.length > 0) {
      const face = faces[0]
      if (face.yawAngle < -35) { // Looking left
        if (stepIndex === 1) setStepIndex(2)
      } else if (face.yawAngle > 35) { // Looking right
        if (stepIndex === 0) setStepIndex(1)
      }
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.launchButton} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Liveness Testi Başlat</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {permissionGranted ? (
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={Camera.Constants.Type.front}
                onFacesDetected={onFacesDetected}
                faceDetectorSettings={{
                  mode: FaceDetector.FaceDetectorMode.fast,
                  detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                  runClassifications: FaceDetector.FaceDetectorClassifications.all,
                  minDetectionInterval: 100,
                  tracking: true,
                }}
              />
            ) : (
              <View style={styles.center}>
                <Text style={{ color: '#fff' }}>Kamera izni gerekiyor</Text>
              </View>
            )}

            <Text style={styles.instruction}>{steps[stepIndex]}</Text>

            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default LivenessTest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: width * 1.2,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  camera: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  instruction: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  launchButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
