import { Stack } from "expo-router";
import { UsuarioProvider } from "../contexts/UsuarioContext";

export default function RootLayout() {
  return (
    <UsuarioProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
        <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UsuarioProvider>
  );
}
