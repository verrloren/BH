'use server';

import * as z from "zod";
import { LoginSchema } from "../schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "@auth/core/errors";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	// Vaieldate fields
	const validatedFields = LoginSchema.safeParse(values);

	
	if(!validatedFields.success) {
		return { error: "Invalid fields"}
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT
		})
	} catch (error) {

		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" }
				default:
					return { error: "Something went wrong!" }
			}
		}
		
		throw error;
	}
}