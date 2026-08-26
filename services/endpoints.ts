/**
 * All BeSafe API endpoints in one place.
 * Base URL can be swapped via env / config.
 *
 * Endpoints below are the ones the frontend expects the backend to expose.
 * The mock service layer resolves these with dummy data; wire the real
 * backend later by flipping the USE_MOCK flag in `api.ts`.
 */

export const API_BASE_URL = 'https://api.besafe.ng/v1';

export const endpoints = {
  // ── Auth ──────────────────────────────────────────────────────────
  auth: {
    requestOtp: '/auth/otp/request',      // POST { phone }
    verifyOtp: '/auth/otp/verify',        // POST { phone, code }
    verifyNin: '/auth/nin/verify',        // POST { nin, dob }
    verifyBvn: '/auth/bvn/verify',        // POST { bvn }
    refresh: '/auth/token/refresh',       // POST { refreshToken }
    me: '/auth/me',                       // GET
    logout: '/auth/logout',               // POST
    setRole: '/auth/role',                // POST { role: 'rider' | 'driver' }
  },

  // ── Riders ────────────────────────────────────────────────────────
  rider: {
    profile: '/rider/profile',            // GET, PATCH
    emergencyContacts: '/rider/emergency-contacts', // GET, POST, DELETE /:id
    trips: '/rider/trips',                // GET
    trip: (id: string) => `/rider/trips/${id}`,
    rateDriver: (tripId: string) => `/rider/trips/${tripId}/rate`, // POST { rating, comment }
  },

  // ── Drivers ───────────────────────────────────────────────────────
  driver: {
    profile: '/driver/profile',           // GET, PATCH
    registerVehicle: '/driver/vehicles',  // POST
    vehicles: '/driver/vehicles',         // GET
    vehicle: (id: string) => `/driver/vehicles/${id}`,
    qrCode: (vehicleId: string) => `/driver/vehicles/${vehicleId}/qr`, // GET (returns QR payload)
    trips: '/driver/trips',               // GET
    backgroundCheckStatus: '/driver/background-check', // GET
    goOnline: '/driver/status/online',    // POST
    goOffline: '/driver/status/offline',  // POST
  },

  // ── Verification (Ride) ───────────────────────────────────────────
  verify: {
    byQr: '/verify/qr',                   // POST { qrToken }
    byPlate: '/verify/plate',             // POST { plate }
    driverPublic: (id: string) => `/verify/driver/${id}`, // GET (public profile)
    vehiclePublic: (id: string) => `/verify/vehicle/${id}`,
  },

  // ── Rides / Trip lifecycle ────────────────────────────────────────
  rides: {
    start: '/rides/start',                // POST { vehicleId, destination? }
    end: (rideId: string) => `/rides/${rideId}/end`,
    cancel: (rideId: string) => `/rides/${rideId}/cancel`,
    updateLocation: (rideId: string) => `/rides/${rideId}/location`, // POST { lat, lng, heading }
    shareLink: (rideId: string) => `/rides/${rideId}/share`,         // POST -> { url }
    live: (rideId: string) => `/rides/${rideId}/live`,               // GET (polling / WS)
  },

  // ── SOS / Emergency ───────────────────────────────────────────────
  sos: {
    trigger: '/sos/trigger',              // POST { rideId?, lat, lng, type }
    cancel: (sosId: string) => `/sos/${sosId}/cancel`, // POST { pin }
    status: (sosId: string) => `/sos/${sosId}`,
    silentTrigger: '/sos/silent',         // POST (background/panic-word)
    notifyContacts: '/sos/notify-contacts', // POST
  },

  // ── Government / integrations ─────────────────────────────────────
  gov: {
    reportIncident: '/gov/incidents',     // POST
    unsafeZones: '/gov/unsafe-zones',     // GET (heatmap data)
  },
};

// Nigerian emergency numbers (for on-device tel: fallback if network fails)
export const EMERGENCY_NUMBERS = {
  police: '112',              // Unified emergency
  policeAlt: '199',
  lasema: '112',              // Lagos State Emergency
  ambulance: '112',
  fire: '112',
  rrs: '767',                 // Lagos Rapid Response Squad
};
