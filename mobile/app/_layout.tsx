import { Stack } from "expo-router";
import { AppProviders } from "../contexts/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
        <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
