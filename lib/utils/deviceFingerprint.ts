/**
 * Device Fingerprint Utility
 *
 * Collects device information for anonymous entity creation
 * Uses Expo Device, Network, and Localization APIs
 */

import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as Localization from 'expo-localization';
import Constants from 'expo-constants';

export interface DeviceFingerprint {
  // Device identification
  deviceId: string | null;
  deviceName: string | null;
  deviceType: string | null;
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  modelId: string | null;

  // Operating system
  osName: string | null;
  osVersion: string | null;
  osBuildId: string | null;
  platformApiLevel: number | null;

  // Application info
  appVersion: string | null;
  appBuildVersion: string | null;
  expoVersion: string | null;

  // Network info
  networkType: string | null;
  ipAddress: string | null;

  // Localization
  timezone: string;
  locale: string;
  locales: string[];
  region: string | null;
  currency: string | null;

  // Screen info
  totalMemory: number | null;
  supportedCpuArchitectures: string[] | null;

  // Timestamp
  collectedAt: string;
}

/**
 * Collects comprehensive device fingerprint
 */
export async function collectDeviceFingerprint(): Promise<DeviceFingerprint> {
  try {
    // Get network information
    let networkType = null;
    let ipAddress = null;
    try {
      const networkState = await Network.getNetworkStateAsync();
      networkType = networkState.type || null;

      const ipAddressResult = await Network.getIpAddressAsync();
      ipAddress = ipAddressResult || null;
    } catch (error) {
      console.warn('Failed to get network info:', error);
    }

    // Collect all device information
    const fingerprint: DeviceFingerprint = {
      // Device identification
      deviceId: await getDeviceId(),
      deviceName: Device.deviceName || null,
      deviceType: Device.deviceType ? getDeviceTypeName(Device.deviceType) : null,
      brand: Device.brand || null,
      manufacturer: Device.manufacturer || null,
      modelName: Device.modelName || null,
      modelId: Device.modelId || null,

      // Operating system
      osName: Device.osName || null,
      osVersion: Device.osVersion || null,
      osBuildId: Device.osBuildId || null,
      platformApiLevel: Device.platformApiLevel || null,

      // Application info
      appVersion: Constants.expoConfig?.version || null,
      appBuildVersion: Constants.expoConfig?.android?.versionCode?.toString() ||
                       Constants.expoConfig?.ios?.buildNumber || null,
      expoVersion: Constants.expoConfig?.sdkVersion || null,

      // Network info
      networkType,
      ipAddress,

      // Localization
      timezone: Localization.timezone,
      locale: Localization.locale,
      locales: Localization.locales ? Localization.locales.map(l => l) : [],
      region: Localization.region || null,
      currency: Localization.currency || null,

      // Screen info
      totalMemory: Device.totalMemory || null,
      supportedCpuArchitectures: Device.supportedCpuArchitectures || null,

      // Timestamp
      collectedAt: new Date().toISOString(),
    };

    return fingerprint;
  } catch (error) {
    console.error('Error collecting device fingerprint:', error);

    // Return minimal fingerprint if collection fails
    return {
      deviceId: null,
      deviceName: null,
      deviceType: null,
      brand: null,
      manufacturer: null,
      modelName: null,
      modelId: null,
      osName: null,
      osVersion: null,
      osBuildId: null,
      platformApiLevel: null,
      appVersion: null,
      appBuildVersion: null,
      expoVersion: null,
      networkType: null,
      ipAddress: null,
      timezone: Localization.timezone,
      locale: Localization.locale,
      locales: Localization.locales.map(l => l),
      region: null,
      currency: null,
      totalMemory: null,
      supportedCpuArchitectures: null,
      collectedAt: new Date().toISOString(),
    };
  }
}

/**
 * Get unique device identifier
 * Uses expo-device API
 */
async function getDeviceId(): Promise<string | null> {
  try {
    // Try to get a unique identifier
    // Note: This may require additional permissions on some platforms
    if (Device.osName === 'iOS') {
      // On iOS, we can use vendorId (changes if app is reinstalled)
      return await Device.getDeviceTypeAsync().then(() =>
        Device.modelId || null
      );
    } else if (Device.osName === 'Android') {
      // On Android, we can use androidId
      // Note: Requires READ_PHONE_STATE permission for some device info
      return Device.osBuildId || Device.modelId || null;
    }

    return Device.modelId || null;
  } catch (error) {
    console.warn('Failed to get device ID:', error);
    return null;
  }
}

/**
 * Convert Device.DeviceType enum to string
 */
function getDeviceTypeName(deviceType: Device.DeviceType): string {
  switch (deviceType) {
    case Device.DeviceType.PHONE:
      return 'phone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.TV:
      return 'tv';
    case Device.DeviceType.UNKNOWN:
    default:
      return 'unknown';
  }
}

/**
 * Generate a simple hash of the fingerprint for comparison
 */
export function hashFingerprint(fingerprint: DeviceFingerprint): string {
  const str = JSON.stringify({
    deviceId: fingerprint.deviceId,
    modelId: fingerprint.modelId,
    osVersion: fingerprint.osVersion,
    brand: fingerprint.brand,
  });

  // Simple hash function (for display purposes, not cryptographic)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36).toUpperCase();
}
