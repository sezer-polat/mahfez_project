-- Enable RLS on the Session table
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows users to access their own sessions
CREATE POLICY "Users can only access their own sessions"
ON "Session"
FOR ALL
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Create a policy that allows the application to manage sessions
CREATE POLICY "Application can manage all sessions"
ON "Session"
FOR ALL
USING (true)
WITH CHECK (true); 