import { Stack } from "expo-router";
import { useLocalization } from "../localization/i18n";

export default function TabLayout() {
  const { t } = useLocalization();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: t("home") }}
      />
    </Stack>
  );
}
