import NextAuth, { type DefaultSession } from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';
import { UserRole } from '@prisma/client';



export const { 
	handlers: { GET, POST }, 
	auth,
	signIn,
	signOut
	} = NextAuth({
		pages: {
			//redirect to this url if something goes wrong
			signIn: "/auth/login",
			error: "/auth/error"
		},
		events: {
			async linkAccount({ user }) {
				await db.user.update({
					where: { id: user.id },
					data: { emailVerified: new Date() }
				})
			}
		},
		callbacks:{
			//passing token from jwt to session and adding new field with value of token id
			async session({ token, session }) {
				console.log({ sessionToken: token })

				//add id to session.user
				if(token.sub && session.user) {
					session.user.id = token.sub
				};

				// add role to session.user

				if(token.role && session.user) {
					//@ts-expect-error 12321
					session.user.role = token.role as UserRole;
				}

				return session
			},	
			async jwt({ token }) {
				/* pass role to token because we can get access from the token
					inside middleware in the request
					hence we can create logic in the middleware
					to check whether user is admin on not 
				*/

				//find user by id and add role to token
				if(!token.sub) return token;

				const existingUser = await getUserById(token.sub);

				if(!existingUser) return token;

				token.role = existingUser.role;

				return token;
			}
		},
		adapter: PrismaAdapter(db),
		session: {
			strategy: 'jwt'
		},
	...authConfig,
})