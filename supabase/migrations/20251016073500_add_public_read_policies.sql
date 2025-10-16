-- Add public read policies for plates and colors
CREATE POLICY "Allow public read plates" ON plates FOR SELECT USING (true);
CREATE POLICY "Allow public read colors" ON colors FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicle_fuels" ON vehicle_fuels FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicle_registrations" ON vehicle_registrations FOR SELECT USING (true);
CREATE POLICY "Allow public read model_versions" ON model_versions FOR SELECT USING (true);
