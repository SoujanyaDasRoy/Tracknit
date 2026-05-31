import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Google ──────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ── Apple ───────────────────────────────────────────────────────────
    // Requires: APPLE_ID (com.company.app), APPLE_TEAM_ID, APPLE_KEY_ID,
    // and APPLE_PRIVATE_KEY (the .p8 file contents as a multiline env var)
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
    }),

    // ── Discord ─────────────────────────────────────────────────────────
    // Requires: DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET
    // from https://discord.com/developers/applications
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Auth errors redirect back to login (not a separate /error page)
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Called after the provider verifies the user.
     * We synchronize the social identity to WordPress here,
     * creating a native WP user if they don't exist yet.
     */
    async signIn({ user, account, profile }) {
      if (!account || !user.email) return false;

      try {
        const wpBase = process.env.NEXT_PUBLIC_WP_URL || "https://your-backend-domain.com";

        // Exchange social token with our WP backend to provision/fetch the WP user.
        const response = await fetch(`${wpBase}/wp-json/tracknit/v1/auth/social-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider:    account.provider,                          // "google" | "apple" | "discord"
            provider_id: account.providerAccountId,                 // Unique ID from the provider
            id_token:    account.id_token    || null,               // Google / Apple id_token
            access_token: account.access_token || null,            // Discord access_token
            email:       user.email,
            name:        user.name  || profile?.name || "",
            avatar:      user.image || "",
          }),
        });

        if (!response.ok) return false;

        const data = await response.json();

        // Attach WP user data directly onto the next-auth user object
        // so the jwt() callback can pick it up.
        (user as any).wpId          = data.user?.id?.toString();
        (user as any).accessToken   = data.access_token;
        (user as any).planTier      = data.user?.plan_tier      || "free";
        (user as any).masterUserId  = data.user?.master_user_id || data.user?.id;
        (user as any).teamId        = data.user?.team_id        || null;
        (user as any).role          = data.user?.role           || "subscriber";

        return true;
      } catch (err) {
        console.error("[Tracknit] social-login sync failed:", err);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Persist WP-enriched fields on first sign-in
      if (user) {
        token.id           = (user as any).wpId          || user.id;
        token.accessToken  = (user as any).accessToken;
        token.planTier     = (user as any).planTier;
        token.masterUserId = (user as any).masterUserId;
        token.teamId       = (user as any).teamId;
        token.role         = (user as any).role;
      }

      // Carry the raw provider id_token for edge calls if needed
      if (account?.id_token)    token.idToken      = account.id_token;
      if (account?.provider)    token.provider     = account.provider;

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore – extend the default session type
        session.user.id          = token.id;
        // @ts-ignore
        session.accessToken      = token.accessToken;
        // @ts-ignore
        session.user.planTier    = token.planTier;
        // @ts-ignore
        session.user.masterUserId = token.masterUserId;
        // @ts-ignore
        session.user.teamId      = token.teamId;
        // @ts-ignore
        session.user.role        = token.role;
        // @ts-ignore
        session.provider         = token.provider;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development",
};
