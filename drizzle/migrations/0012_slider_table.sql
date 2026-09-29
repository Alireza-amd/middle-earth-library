CREATE TABLE "sliders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "imagePath" varchar NOT NULL,
    "link" varchar NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
