import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente al home
    router.replace('/(tabs)/home');
  }, [router]);

  return null;
}
