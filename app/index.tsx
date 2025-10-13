import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a tela de feed
    router.replace('/feed');
  }, []);
  return null; // O redirecionamento acontece no useEffect
}