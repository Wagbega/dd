/*
  # Create stats table for solar calculations

  1. New Tables
    - `stats`
      - `id` (bigint, primary key)
      - `created_at` (timestamp with timezone)
      - `daily_usage` (numeric)
      - `sun_hours` (numeric)
      - `backup_days` (numeric)
      - `efficiency` (numeric)
      - `solar_size` (numeric)
      - `battery_size` (numeric)
      - `inverter_size` (numeric)

  2. Security
    - Enable RLS on `stats` table
    - Add policies for inserting and reading stats
*/

CREATE TABLE IF NOT EXISTS stats (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  daily_usage numeric NOT NULL,
  sun_hours numeric NOT NULL,
  backup_days numeric NOT NULL,
  efficiency numeric NOT NULL,
  solar_size numeric NOT NULL,
  battery_size numeric NOT NULL,
  inverter_size numeric NOT NULL
);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new calculations
CREATE POLICY "Anyone can insert stats"
  ON stats
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read stats
CREATE POLICY "Anyone can read stats"
  ON stats
  FOR SELECT
  TO anon
  USING (true);