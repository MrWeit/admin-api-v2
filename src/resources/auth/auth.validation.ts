import { object, string, number, TypeOf } from "zod";

//Verify OTP
export const loginAdminUserSchema = object({
	username: string({
		required_error: "username is required",
	}),
	password: string({
		required_error: "password is required",
	}),
});

export type LoginAdminUserSchema = TypeOf<typeof loginAdminUserSchema>;
