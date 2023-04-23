export const confDev = {
  loglevel: "debug",
  port: 9000,
  auth: {
    jwt: {
      expirationInterval: 24 * 60 * 60 * 1000, // ms (24 hour)
      issuer: "SDP2_T03",
      audience: "SDP2_T03",
    },
  },
};
