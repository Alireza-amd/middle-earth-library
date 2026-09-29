CREATE TABLE "comment_likes" (
	"commentId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"like" boolean NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comment_likes_commentId_userId_pk" PRIMARY KEY("commentId","userId")
);
--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;