/*
  # Create contact messages table

  1. New Tables
    - `contact_messages`
      - `id` (bigint, primary key)
      - `created_at` (timestamptz)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `service` (text)
      - `message` (text)
      - `status` (text)

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for inserting new messages
    - Add policy for admin to read messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'))
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admin) can read messages
CREATE POLICY "Only authenticated users can read messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);