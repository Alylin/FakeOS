// import NextAuth from 'next-auth/next';
// import Credentials from 'next-auth/providers/credentials';

// export const {
//   handlers, signIn, signOut, auth,
// } = NextAuth({
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         email: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         if (!credentials) {
//           throw new Error('error');
//         }
  
//         // logic to salt and hash password
//         const pwHash = saltAndHashPassword(credentials.password);
  
//         // logic to verify if the user exists
//         const user = await getUserFromDb(credentials.email, pwHash);
  
//         if (!user) {
//           throw new Error('user not found')
//         }
  
//         return user
//       },
//     })
//   ],
// });
