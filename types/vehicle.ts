export type RelationshipType = 'owner' | 'renter' | 'authorized_driver';
export type VehicleStatus = 'active' | 'former';

export interface Vehicle {
  id: number;
  name: string;
  model: string;
  plate: string;
  color: string;
  year: number;
  relationshipType: RelationshipType;
  status: VehicleStatus;
  relationshipStart: string;
  lastEvent: string;
  odometer?: number;
  fuelType?: string;
}

export interface ActivityDetail {
  label: string;
  value: string;
}

export type ActivityType = 'link' | 'alert' | 'maintenance' | 'fuel' | 'tire' | 'km';
export type ActivityStatus = 'active' | 'warning' | 'completed';

export interface Activity {
  id: number;
  type: ActivityType;
  icon: any;
  title: string;
  description: string;
  time: string;
  linkType?: string;
  isActive?: boolean;
  details?: ActivityDetail[];
  status?: ActivityStatus;
}

export interface DateGroup {
  date: string;
  activities: Activity[];
}

export interface RelationshipConfig {
  [key: string]: {
    label: string;
  };
}
