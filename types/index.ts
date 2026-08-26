export type UserRole = "rider" | "driver";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "expired";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  role: UserRole;
  nin?: string;
  ninStatus: VerificationStatus;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export type VehicleType = "car" | "bus" | "tricycle" | "motorcycle" | "minivan";

export interface Vehicle {
  id: string;
  ownerId: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vin?: string;
  photos: string[];
  qrToken: string; // encoded token embedded in QR
  registrationStatus: VerificationStatus;
  registeredAt: string;
}

export interface Driver extends User {
  role: "driver";
  licenseNumber: string;
  licenseStatus: VerificationStatus;
  backgroundCheckStatus: VerificationStatus;
  rating: number; // 0..5
  totalTrips: number;
  vehicles: Vehicle[];
  isOnline: boolean;
}

// BeSafe's ride model = "a monitored time-span".
// Rider scans → tracking starts. Rider taps "arrived safely" → tracking ends.
// No pickup, no destination, no fare, no route.
export type RideStatus =
  | "active" // currently being tracked
  | "completed" // rider tapped arrived safely
  | "cancelled"
  | "sos";

export interface Location {
  lat: number;
  lng: number;
  timestamp?: string;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  vehicleId: string;
  status: RideStatus;
  startedAt: string;
  endedAt?: string;
  currentLocation?: Location;
  /** Emergency-contact IDs the rider chose to share this trip with */
  sharedWith: string[];
}

export type SosType = "panic" | "silent" | "crash" | "medical";
export type SosStatus = "active" | "resolved" | "cancelled" | "false_alarm";

export interface SosEvent {
  id: string;
  userId: string;
  rideId?: string;
  type: SosType;
  status: SosStatus;
  triggeredAt: string;
  location: Location;
  notifiedContacts: string[];
  notifiedAuthorities: string[];
  responseEtaSec?: number;
}

export interface UnsafeZone {
  id: string;
  center: Location;
  radiusMeters: number;
  severity: "low" | "medium" | "high";
  incidentCount: number;
  label?: string;
}
