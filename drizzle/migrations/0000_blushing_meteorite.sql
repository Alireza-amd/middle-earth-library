CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"salt" text,
	"password" text,
	"is_verified" boolean NOT NULL,
	"role" "user_roles" NOT NULL,
	"banned" boolean NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
