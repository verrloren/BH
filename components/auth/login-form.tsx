'use client';

import { useForm } from "react-hook-form"
import { LoginSchema } from '@/schemas/index';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {

	const searchParams = useSearchParams();
	const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
		? "Email already used with different account!"
		: "";
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, setTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError("")
		setSuccess("")

		setTransition(() => {
			//data send to server
			login(values)
				//data received from server
				.then((data) => {
					setError(data?.error)
					//TODO: 2factor auth 
					// setSuccess(data?.success)
				})
		})
	}

	return (
		<div className="w-3/4 sm:w-1/2">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input disabled={isPending} type='email' placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input disabled={isPending} type='password' placeholder="Password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormError message={error || urlError} />
					<FormSuccess message={success} />

					<Button variant="white" disabled={isPending} className="w-full " type="submit">Login</Button>
				</form>
			</Form>
		</div>
	)
}