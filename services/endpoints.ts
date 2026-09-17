export const API_BASE_URL = "http://localhost:4000";

export const endpoints = {
  auth: {
    requestOtp: "/auth/otp/request",
    verifyOtp: "/auth/otp/verify",
    verifyNin: "/auth/nin/verify",
    setSosPin: "/auth/sos-pin",
    refresh: "/auth/refresh",
    me: "/auth/me",
    logout: "/auth/logout",
    setRole: "/auth/role",
  },
  driver: {
    me: "/driver/me",
    verifyLicense: "/driver/license/verify",
    vehicles: "/driver/vehicles",
    vehicle: (id: string) => `/driver/vehicles/${id}`,
    online: "/driver/online",
  },
  verify: {
    byQr: "/verify/qr",
    byPlate: "/verify/plate",
  },
  rider: {
    contacts: "/rider/contacts",
  },
  rides: {
    start: "/rides",
    ping: (id: string) => `/rides/${id}/ping`,
    end: (id: string) => `/rides/${id}/end`,
    shares: (id: string) => `/rides/${id}/shares`,
    watch: (token: string) => `/rides/watch/${token}`,
    history: "/rides/history",
  },
  sos: {
    trigger: "/sos",
    cancel: (id: string) => `/sos/${id}/cancel`,
    resolve: (id: string) => `/sos/${id}/resolve`,
    mine: "/sos/mine",
  },
};

export const EMERGENCY_NUMBERS = {
  police: "112",
  policeAlt: "199",
  lasema: "112",
  ambulance: "112",
  fire: "112",
  rrs: "767",
};
