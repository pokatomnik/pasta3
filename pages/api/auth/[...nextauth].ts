import { env } from 'process';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import YandexProvider from 'next-auth/providers/yandex';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  secret: env.NEXT_AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    YandexProvider({
      clientId: env.YANDEX_CLIENT_ID,
      clientSecret: env.YANDEX_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});
