-- Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create Reports Table
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  date DATE,
  "jobNumber" TEXT,
  department TEXT,
  "workOrderNumber" TEXT,
  client TEXT,
  "siteName" TEXT,
  supervisor TEXT,
  "dateInspected" DATE,
  team JSONB,
  "currentWork" TEXT,
  "completedWork" TEXT,
  "daysOnTask" INTEGER,
  "percentageCompleted" INTEGER,
  "estimatedDaysRemaining" INTEGER,
  "delayedWork" BOOLEAN,
  "environmentalFactors" BOOLEAN
);

-- Enable RLS for Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reports are viewable by everyone for now."
  ON public.reports FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can create reports."
  ON public.reports FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own reports."
  ON public.reports FOR UPDATE
  USING ( auth.uid() = user_id );
