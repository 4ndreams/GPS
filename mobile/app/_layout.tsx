import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
      <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
