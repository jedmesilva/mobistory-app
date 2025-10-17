import { Stack } from 'expo-router';
import { SelectedVehicleProvider, AuthEntityProvider } from '@/contexts';

export default function Layout() {
  return (
    <AuthEntityProvider>
      <SelectedVehicleProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SelectedVehicleProvider>
    </AuthEntityProvider>
  );
}