import {
  Driver,
  EmergencyContact,
  Ride,
  UnsafeZone,
  User,
  Vehicle,
} from "@/types";

// ── Lagos landmark coordinates ─────────────────────────────────────
export const LAGOS_CENTER = { lat: 6.5244, lng: 3.3792 };

export const LAGOS_LANDMARKS = {
  ikeja: { lat: 6.6018, lng: 3.3515, name: "Ikeja" },
  lekki: { lat: 6.4474, lng: 3.4553, name: "Lekki Phase 1" },
  vi: { lat: 6.4281, lng: 3.4219, name: "Victoria Island" },
  yaba: { lat: 6.5158, lng: 3.3696, name: "Yaba" },
  surulere: { lat: 6.4923, lng: 3.3577, name: "Surulere" },
  ajah: { lat: 6.4658, lng: 3.5629, name: "Ajah" },
  ikoyi: { lat: 6.455, lng: 3.4353, name: "Ikoyi" },
  ojota: { lat: 6.585, lng: 3.3841, name: "Ojota" },
};

// ── Emergency contacts (sample) ────────────────────────────────────
export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: "ec_1",
    name: "Chidinma (Mum)",
    phone: "+2348023456789",
    relationship: "Mother",
    priority: 1,
  },
  {
    id: "ec_2",
    name: "Tunde (Bro)",
    phone: "+2348097654321",
    relationship: "Brother",
    priority: 2,
  },
  {
    id: "ec_3",
    name: "Amaka (Best friend)",
    phone: "+2348156789432",
    relationship: "Friend",
    priority: 3,
  },
];

// ── Sample authenticated user (rider) ──────────────────────────────
export const mockRider: User = {
  id: "user_r_001",
  fullName: "Adaeze Okonkwo",
  phone: "+2348012345678",
  email: "adaeze@example.com",
  photoUrl: "https://i.pravatar.cc/300?img=47",
  role: "rider",
  nin: "12345678901",
  ninStatus: "verified",
  createdAt: "2024-11-01T09:00:00Z",
};

// ── Sample driver ──────────────────────────────────────────────────
export const mockDriverAccount: Driver = {
  id: "user_d_001",
  fullName: "Emeka Nwosu",
  phone: "+2348034567890",
  email: "emeka.n@example.com",
  photoUrl: "https://i.pravatar.cc/300?img=15",
  role: "driver",
  nin: "98765432109",
  ninStatus: "verified",
  licenseNumber: "LAG-DL-8842116",
  licenseStatus: "verified",
  backgroundCheckStatus: "verified",
  rating: 4.8,
  totalTrips: 342,
  isOnline: true,
  createdAt: "2024-08-14T09:00:00Z",
  vehicles: [
    {
      id: "veh_001",
      ownerId: "user_d_001",
      type: "car",
      brand: "Toyota",
      model: "Corolla",
      year: 2019,
      color: "Silver",
      plateNumber: "LAG-482-XA",
      photos: [],
      qrToken: "BSF.VEH.veh_001.a7f8e2d1c9b4",
      registrationStatus: "verified",
      registeredAt: "2024-08-15T10:20:00Z",
    },
  ],
};

// ── Nearby drivers for the rider home map ──────────────────────────
export const mockNearbyDrivers: (Driver & { distance: string })[] = [
  {
    ...mockDriverAccount,
    id: "user_d_002",
    fullName: "Emeka Nwosu",
    photoUrl: "https://i.pravatar.cc/300?img=15",
    rating: 4.9,
    totalTrips: 342,
    distance: "250m",
    vehicles: [{ ...mockDriverAccount.vehicles[0], plateNumber: "LAG-482-XA" }],
  },
  {
    ...mockDriverAccount,
    id: "user_d_003",
    fullName: "Bola Adebayo",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    rating: 4.7,
    totalTrips: 189,
    distance: "600m",
    vehicles: [
      {
        ...mockDriverAccount.vehicles[0],
        id: "veh_002",
        brand: "Honda",
        model: "Accord",
        color: "Black",
        plateNumber: "LSD-772-KJA",
        qrToken: "BSF.VEH.veh_002.d4c8e9b1a7f2",
      },
    ],
  },
  {
    ...mockDriverAccount,
    id: "user_d_004",
    fullName: "Ifeoma Eze",
    photoUrl: "https://i.pravatar.cc/300?img=45",
    rating: 4.85,
    totalTrips: 501,
    distance: "900m",
    vehicles: [
      {
        ...mockDriverAccount.vehicles[0],
        id: "veh_003",
        brand: "Toyota",
        model: "Sienna",
        color: "White",
        plateNumber: "IKJ-330-XM",
        qrToken: "BSF.VEH.veh_003.9a3c7f2e8d1b",
      },
    ],
  },
];

// ── Trip history — a "trip" is just a monitored time-span. No routes, no fares. ──
export const mockTripHistory: Ride[] = [
  {
    id: "ride_001",
    riderId: "user_r_001",
    driverId: "user_d_002",
    vehicleId: "veh_001",
    status: "completed",
    startedAt: "2026-08-18T07:12:00Z",
    endedAt: "2026-08-18T07:48:00Z",
    sharedWith: ["ec_1", "ec_2"],
  },
  {
    id: "ride_002",
    riderId: "user_r_001",
    driverId: "user_d_003",
    vehicleId: "veh_002",
    status: "completed",
    startedAt: "2026-08-15T18:20:00Z",
    endedAt: "2026-08-15T19:05:00Z",
    sharedWith: ["ec_1"],
  },
  {
    id: "ride_003",
    riderId: "user_r_001",
    driverId: "user_d_004",
    vehicleId: "veh_003",
    status: "completed",
    startedAt: "2026-08-11T14:00:00Z",
    endedAt: "2026-08-11T14:35:00Z",
    sharedWith: ["ec_1", "ec_2", "ec_3"],
  },
];

// ── Unsafe zones (govt heatmap sample) ─────────────────────────────
export const mockUnsafeZones: UnsafeZone[] = [
  {
    id: "uz_1",
    center: { lat: 6.47, lng: 3.54 },
    radiusMeters: 800,
    severity: "high",
    incidentCount: 23,
    label: "Sangotedo axis — recent reports",
  },
  {
    id: "uz_2",
    center: { lat: 6.535, lng: 3.36 },
    radiusMeters: 500,
    severity: "medium",
    incidentCount: 8,
    label: "Oshodi under-bridge",
  },
  {
    id: "uz_3",
    center: { lat: 6.61, lng: 3.34 },
    radiusMeters: 450,
    severity: "low",
    incidentCount: 3,
    label: "Ikeja by night",
  },
];

// ── Helper: build a QR payload for a vehicle ───────────────────────
export function buildQrPayload(vehicle: Vehicle) {
  return JSON.stringify({
    v: 1,
    t: "besafe.vehicle",
    id: vehicle.id,
    token: vehicle.qrToken,
    plate: vehicle.plateNumber,
    issuedAt: new Date().toISOString(),
  });
}
