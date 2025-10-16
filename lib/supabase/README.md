# Supabase Integration

This directory contains the Supabase client configuration and related utilities.

## Files

- `client.ts` - Supabase client instance configured with environment variables

## Environment Variables

The following environment variables are required (already configured in `.env`):

```
EXPO_PUBLIC_SUPABASE_URL=https://fsjncmqncdjevxvikdxo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Usage

### Import the client

```typescript
import { supabase } from '@/lib/supabase/client'
```

### Use hooks for data fetching

```typescript
import { useVehicles } from '@/hooks/vehicle'

function MyComponent() {
  const { vehicles, loading, error, refetch } = useVehicles()
  
  if (loading) return <ActivityIndicator />
  if (error) return <Text>Error: {error.message}</Text>
  
  return (
    <FlatList
      data={vehicles}
      renderItem={({ item }) => <VehicleCard vehicle={item} />}
    />
  )
}
```

### Direct queries

```typescript
// Fetch vehicles
const { data, error } = await supabase
  .from('vehicles')
  .select('*, brands(*), models(*)')
  .eq('active', true)

// Insert a vehicle
const { data, error } = await supabase
  .from('vehicles')
  .insert({
    brand_id: '...',
    model_id: '...',
    chassis: '...',
    model_year: 2024,
    manufacture_year: 2024,
  })

// Update a vehicle
const { data, error } = await supabase
  .from('vehicles')
  .update({ active: false })
  .eq('id', vehicleId)

// Delete (soft delete by setting active = false is recommended)
const { data, error } = await supabase
  .from('vehicles')
  .update({ active: false })
  .eq('id', vehicleId)
```

## Database Schema

The database schema is defined in TypeScript types at `types/database/types.ts`.

Main tables:
- `vehicles` - Vehicle information
- `brands` - Vehicle brands
- `models` - Vehicle models
- `model_versions` - Model versions
- `plates` - Vehicle plates
- `colors` - Vehicle colors
- `vehicle_fuels` - Vehicle fuel types
- `fuels` - Fuel types reference
- `countries` - Countries reference
- `vehicle_categories` - Vehicle categories

## Hooks

Available hooks in `hooks/vehicle/`:
- `useVehicles()` - Fetch all vehicles with related data
- `useVehicle(id)` - Fetch a single vehicle by ID

## Real-time Subscriptions

```typescript
// Subscribe to vehicles changes
const subscription = supabase
  .channel('vehicles-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'vehicles' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// Unsubscribe when component unmounts
return () => {
  subscription.unsubscribe()
}
```
