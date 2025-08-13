import NextAuth from "next-auth";
import authOptions from "../authOptions";

// Extend the Session type to include id on user
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}


// --- Use authOptions for NextAuth handler ---
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };