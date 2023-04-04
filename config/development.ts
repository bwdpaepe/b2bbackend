export const confDev = {
  loglevel: "debug",
  port: 9000,
  auth: {
    jwt: {
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: "SDP2_T03",
      audience: "SDP2_T03",
    },
  },
};
