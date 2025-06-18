'use client';

import { useForm } from "react-hook-form"
import { RegisterSchema } from '@/schemas/index';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {

	const router = useRouter();
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, setTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: ''
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setError("")
		setSuccess("")

		setTransition(() => {
			//data send to server
			register(values)
				//data received from server
				.then((data) => {
					setError(data.error)
					setSuccess(data.success)
				})
				.finally(() => {
					form.reset()
					router.push('/auth/login')
				})
		})
	}

	return (
		<div className="w-3/4 sm:w-1/2">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input disabled={isPending} placeholder="Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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

					<FormError message={error} />
					<FormSuccess message={success} />

					<Button variant="white" disabled={isPending} className="w-full" type="submit">Sign up</Button>
				</form>
			</Form>
		</div>
	)
}