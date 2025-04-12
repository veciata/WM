import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import * as Localization from "@localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { UserService } from "@/components/services/user";
import * as Notifications from "expo-notifications";

interface UserInfo {
  name: string;
  lastName: string;
  userEmail: string;
  userBalance: number;
  userCreatedAt: string;
  userPhone?: string;
  userProfilePicture?: string;
  isPhoneVerified: boolean;
  isFacebookVerified: boolean;
  isEmailVerified: boolean;
}

const ProfileScreen: React.FC = () => {
  const { t, currentLanguage } = Localization.useLocalization();
  const router = useRouter();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // First try to get fresh data from API
        const freshUserData = await UserService.fetchUserData();

        // If API fails, fall back to stored data
        const userData = freshUserData || (await UserService.getStoredUser());

        if (!userData) {
          await AsyncStorage.multiRemove(["user", "token"]);
          router.replace("/auth/login");
          return;
        }

        setUserInfo({
          name: userData.name || t("profile.default_first_name"),
          lastName: userData.lastName || t("profile.default_last_name"),
          userEmail: userData.email || t("profile.default_email"),
          userBalance: userData.balance || 0,
          userCreatedAt: formatDate(userData.created_at),
          userPhone: userData.phone,
          userProfilePicture: userData.profile_picture,
          isPhoneVerified: userData.phone_verified,
          isFacebookVerified: userData.facebook_verified,
          isEmailVerified: userData.email_verified,
        });

        if (userData.profile_picture) {
          setProfileImage(userData.profile_picture);
        }

        // Check notification permission status
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationStatus(status);
      } catch (error) {
        console.error("Error fetching user info:", error);
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const formatDate = (dateString: string) => {
    const localeMap: { [key: string]: string } = {
      en: "en-US",
      tr: "tr-TR",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
    };

    const locale = localeMap[currentLanguage] || "en-US";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format");
      return "";
    }

    return date.toLocaleDateString(locale, options);
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        await AsyncStorage.multiRemove(["user", "token"]);
        router.replace("/auth/login");
        return;
      }

      const response = await fetch(
        "https://api.world-moneys.com/public/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await AsyncStorage.multiRemove(["user", "token"]);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // Here you would typically upload the image to your server
    }
  };

  const handlePushNotificationsPermission = async (): Promise<void> => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        setNotificationStatus(status);
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          t("notification_permission_required"),
          t("notification_permission_message"),
        );
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Push token:", token);
      // You would typically send this token to your backend server
    } catch (error) {
      console.error("Error getting push notification permission:", error);
    }
  };

  const handleAccountDeletion = async () => {
    // Add logic to delete the account
    Alert.alert(t("delete_account_title"), t("delete_account_message"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("delete"),
        onPress: async () => {
          // Implement actual deletion logic
          console.log("Account deletion requested");
        },
        style: "destructive",
      },
    ]);
  };

  if (loading || !userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const inviteLink = `world-money.com/invate/@${userInfo?.name?.toLowerCase()}${userInfo?.lastName?.toLowerCase()}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialIcons name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={styles.editIcon}>
              <Feather name="edit" size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.username}>
          {userInfo.name} {userInfo.lastName}
        </Text>
        <Text style={styles.email}>{userInfo.userEmail}</Text>

        <TouchableOpacity
          style={styles.inviteContainer}
          onPress={() => Linking.openURL(`https://${inviteLink}`)}
        >
          <Text style={styles.inviteLink}>{t("inviteLink")}</Text>
          <MaterialIcons name="content-copy" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceValue}>{userInfo.userBalance} WM</Text>
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("account_information")}</Text>
        <View style={styles.infoItem}>
          <MaterialIcons
            name="person-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {userInfo.name} {userInfo.lastName}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>{userInfo.userEmail}</Text>
          {userInfo.isEmailVerified ? (
            <MaterialIcons name="verified" size={20} color={colors.success} />
          ) : (
            <MaterialIcons
              name="error-outline"
              size={20}
              color={colors.warning}
            />
          )}
        </View>
        {userInfo.userPhone && (
          <View style={styles.infoItem}>
            <MaterialIcons
              name="phone"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>{userInfo.userPhone}</Text>
            {userInfo.isPhoneVerified ? (
              <MaterialIcons name="verified" size={20} color={colors.success} />
            ) : (
              <MaterialIcons
                name="error-outline"
                size={20}
                color={colors.warning}
              />
            )}
          </View>
        )}
        <View style={styles.infoItem}>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {t("member_since")} {userInfo.userCreatedAt}
          </Text>
        </View>
      </View>

      {/* Verification Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("verification_status")}</Text>
        <View style={styles.verificationItem}>
          <MaterialIcons name="email" size={20} color={colors.textSecondary} />
          <Text style={styles.verificationText}>{t("email_verification")}</Text>
          <View style={styles.verificationStatus}>
            {userInfo.isEmailVerified ? (
              <>
                <MaterialIcons
                  name="verified"
                  size={20}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.success },
                  ]}
                >
                  {t("verified")}
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={colors.warning}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.warning },
                  ]}
                >
                  {t("not_verified")}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.verificationItem}>
          <MaterialIcons name="phone" size={20} color={colors.textSecondary} />
          <Text style={styles.verificationText}>{t("phone_verification")}</Text>
          <View style={styles.verificationStatus}>
            {userInfo.isPhoneVerified ? (
              <>
                <MaterialIcons
                  name="verified"
                  size={20}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.success },
                  ]}
                >
                  {t("verified")}
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={colors.warning}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.warning },
                  ]}
                >
                  {t("not_verified")}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.verificationItem}>
          <MaterialIcons
            name="facebook"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.verificationText}>
            {t("facebook_verification")}
          </Text>
          <View style={styles.verificationStatus}>
            {userInfo.isFacebookVerified ? (
              <>
                <MaterialIcons
                  name="verified"
                  size={20}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.success },
                  ]}
                >
                  {t("verified")}
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={colors.warning}
                />
                <Text
                  style={[
                    styles.verificationStatusText,
                    { color: colors.warning },
                  ]}
                >
                  {t("not_verified")}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("actions")}</Text>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialIcons
            name="settings"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.actionText}>{t("profile_settings")}</Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate("PasswordUpdate")}
        >
          <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{t("update_password")}</Text>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handlePushNotificationsPermission}
        >
          <MaterialIcons
            name="notifications"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={styles.actionText}>{t("notification_settings")}</Text>
          {notificationStatus === "granted" ? (
            <MaterialIcons
              name="check-circle"
              size={20}
              color={colors.success}
            />
          ) : (
            <MaterialIcons
              name="error-outline"
              size={20}
              color={colors.warning}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.danger }]}>
          {t("danger_zone")}
        </Text>
        <TouchableOpacity
          style={[styles.actionItem, { borderColor: colors.danger }]}
          onPress={handleAccountDeletion}
        >
          <MaterialIcons name="delete" size={20} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>
            {t("delete_account")}
          </Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <Button
        mode="contained"
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonText}
        onPress={logout}
      >
        {t("logout")}
      </Button>
    </ScrollView>
  );
};

const colors = {
  primary: "#3d6a70",
  secondary: "#f8f9fa",
  text: "#333",
  textSecondary: "#666",
  success: "#28a745",
  warning: "#ffc107",
  danger: "#dc3545",
  border: "#e9ecef",
  background: "#fff",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  inviteContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inviteLink: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#daba71",
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  verificationText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  verificationStatusText: {
    fontSize: 14,
    marginLeft: 5,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
