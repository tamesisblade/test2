module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'b65227fdb6bdc5afca903693f638066e'),
    },
  },
});

// module.exports = ({ env }) => ({
//   host: env('HOST', '194.163.164.186'),
//   port: env.int('PORT', 1337),
//   admin: {
//    auth: {
//      secret: env('ADMIN_JWT_SECRET', 'b65227fdb6bdc5afca903693f638066e'),
//    },
//   },
// });

