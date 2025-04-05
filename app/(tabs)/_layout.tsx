import { Stack } from "expo-router";
import { useLocalization } from "@localization/i18n";

export default function TabLayout() {
  const { t } = useLocalization();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTitle: () => null
        }}
      />
    </Stack>
  );
}
