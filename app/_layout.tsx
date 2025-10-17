import { Stack } from 'expo-router';
import { SelectedVehicleProvider } from '@/contexts';

export default function Layout() {
  return (
    <SelectedVehicleProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SelectedVehicleProvider>
  );
}