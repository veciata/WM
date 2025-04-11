import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalization } from "@localization/i18n";
import * as ImagePicker from "expo-image-picker";
import LivenessTest from "@components/LivenessTest";

const countries = [
  { code: "TR", name: "Türkiye", idType: "TC Kimlik No", idLength: 11 },
  {
    code: "US",
    name: "Amerika Birleşik Devletleri",
    idType: "SSN",
    idLength: 9,
  },
  {
    code: "GB",
    name: "Birleşik Krallık",
    idType: "National Insurance Number",
    idLength: 9,
  },
  { code: "DE", name: "Almanya", idType: "Personalausweis", idLength: 9 },
  {
    code: "FR",
    name: "Fransa",
    idType: "Carte Nationale d'Identité",
    idLength: 15,
  },
  { code: "IT", name: "İtalya", idType: "Carta d'Identità", idLength: 9 },
  { code: "ES", name: "İspanya", idType: "DNI", idLength: 9 },
  { code: "JP", name: "Japonya", idType: "My Number", idLength: 12 },
  {
    code: "KR",
    name: "Güney Kore",
    idType: "Resident Registration Number",
    idLength: 13,
  },
  { code: "CN", name: "Çin", idType: "ID Card", idLength: 18 },
];

const KYCScreen: React.FC = () => {
  const { t } = useLocalization();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    birthDate: "",
    address: "",
    idNumber: "",
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
  });

  const pickImage = async (type: "idFront" | "idBack" | "selfie") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        [type === "idFront"
          ? "idFrontImage"
          : type === "idBack"
            ? "idBackImage"
            : "selfieImage"]: result.assets[0].uri,
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Burada KYC form verilerini API'ye gönderme işlemi yapılacak
    console.log("KYC Form Data:", { ...formData, country: selectedCountry });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 1: Kimlik Bilgileri</Text>

            <Text style={styles.label}>Ülke</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCountry.code}
                onValueChange={(itemValue) => {
                  const country = countries.find((c) => c.code === itemValue);
                  if (country) {
                    setSelectedCountry(country);
                    setFormData((prev) => ({ ...prev, idNumber: "" }));
                  }
                }}
                style={styles.picker}
              >
                {countries.map((country) => (
                  <Picker.Item
                    key={country.code}
                    label={country.name}
                    value={country.code}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Doğum Tarihi</Text>
            <TextInput
              style={styles.input}
              value={formData.birthDate}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, birthDate: text }))
              }
              placeholder="GG/AA/YYYY"
            />

            <Text style={styles.label}>{selectedCountry.idType}</Text>
            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, idNumber: text }))
              }
              placeholder={`${selectedCountry.idLength} haneli ${selectedCountry.idType}`}
              keyboardType="numeric"
              maxLength={selectedCountry.idLength}
            />

            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>İleri</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 2: Adres Bilgileri</Text>
            <Text style={styles.label}>Adres</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              placeholder="Tam adresiniz"
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={handleBack}
              >
                <Text style={styles.buttonText}>Geri</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>İleri</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 3: Fotoğraf Yükleme</Text>
            <Text style={styles.label}>Kimlik Ön Yüzü</Text>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={() => pickImage("idFront")}
            >
              {formData.idFrontImage ? (
                <Image
                  source={{ uri: formData.idFrontImage }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.uploadText}>Fotoğraf Yükle</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Kimlik Arka Yüzü</Text>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={() => pickImage("idBack")}
            >
              {formData.idBackImage ? (
                <Image
                  source={{ uri: formData.idBackImage }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.uploadText}>Fotoğraf Yükle</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Selfie (Canlılık Testi)</Text>
            <LivenessTest
              onSuccess={(imageUri) => {
                setFormData((prev) => ({
                  ...prev,
                  selfieImage: imageUri,
                }));
                Alert.alert(
                  "Basarılı",
                  "Canlılık testiniz başarıyla tamamlandı.",
                );
              }}
              onError={(error) => {
                console.error("Liveness test hatası:", error);
                Alert.alert("Hata", error.message);
              }}
            />

            {/* Show the captured selfie if available */}
            {formData.selfieImage && (
              <View style={styles.imageUploadButton}>
                <Image
                  source={{ uri: formData.selfieImage }}
                  style={styles.previewImage}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={handleBack}
              >
                <Text style={styles.buttonText}>Geri</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!formData.selfieImage} // Disable if no selfie
              >
                <Text style={styles.buttonText}>Onayla ve Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>KYC Onay</Text>
      <Text style={styles.subtitle}>
        Lütfen kimlik doğrulama için gerekli bilgileri doldurun
      </Text>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressStep,
            currentStep >= 1 && styles.progressStepActive,
          ]}
        >
          <Text
            style={[
              styles.progressText,
              currentStep >= 1 && styles.progressTextActive,
            ]}
          >
            1
          </Text>
        </View>
        <View
          style={[
            styles.progressLine,
            currentStep >= 2 && styles.progressLineActive,
          ]}
        />
        <View
          style={[
            styles.progressStep,
            currentStep >= 2 && styles.progressStepActive,
          ]}
        >
          <Text
            style={[
              styles.progressText,
              currentStep >= 2 && styles.progressTextActive,
            ]}
          >
            2
          </Text>
        </View>
        <View
          style={[
            styles.progressLine,
            currentStep >= 3 && styles.progressLineActive,
          ]}
        />
        <View
          style={[
            styles.progressStep,
            currentStep >= 3 && styles.progressStepActive,
          ]}
        >
          <Text
            style={[
              styles.progressText,
              currentStep >= 3 && styles.progressTextActive,
            ]}
          >
            3
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>{renderStep()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  progressStepActive: {
    backgroundColor: "#daba71",
  },
  progressText: {
    color: "#666",
    fontWeight: "bold",
  },
  progressTextActive: {
    color: "#fff",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: "#daba71",
  },
  formContainer: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    height: 200,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: "#daba71",
  },
  backButton: {
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: "#daba71",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default KYCScreen;
