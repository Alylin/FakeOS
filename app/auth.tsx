import NextAuth from 'next-auth/next';

export const {
  handlers, signIn, signOut, auth,
} = NextAuth({
  providers: [],
});
