import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="new-update"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
