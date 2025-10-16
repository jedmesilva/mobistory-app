require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEntityLinks() {
  console.log('🧪 Testing Entities and Vehicle Links Integration\n');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Supabase Key: ${supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'NOT SET'}\n`);

  try {
    // Test 1: Fetch all entities
    console.log('📋 Test 1: Fetching all entities...');
    const { data: entities, error: entitiesError } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: true });

    if (entitiesError) {
      console.error('Supabase error:', entitiesError);
      throw entitiesError;
    }

    console.log(`✅ Found ${entities.length} entities:\n`);
    entities.forEach((entity) => {
      console.log(`   - ${entity.name} (${entity.entity_type})`);
    });

    // Test 2: Fetch vehicles with their links
    console.log('\n📋 Test 2: Fetching vehicles with entity links...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands (brand),
        models (model),
        model_versions (version),
        plates (plate, state, active),
        colors (color, active),
        vehicle_entity_links (
          id,
          relationship_type,
          status,
          start_date,
          end_date,
          active,
          entities!vehicle_entity_links_entity_id_fkey (
            name,
            entity_type,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (vehiclesError) throw vehiclesError;

    console.log(`✅ Found ${vehicles.length} vehicles:\n`);

    vehicles.forEach((vehicle) => {
      const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
      const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0];

      console.log(`\n🚗 ${vehicle.brands.brand} ${vehicle.models.model} ${vehicle.model_versions?.version || ''}`);
      console.log(`   Placa: ${activePlate?.plate || 'N/A'}`);
      console.log(`   Cor: ${activeColor?.color || 'N/A'}`);
      console.log(`   Vínculos (${vehicle.vehicle_entity_links?.length || 0}):`);

      if (vehicle.vehicle_entity_links && vehicle.vehicle_entity_links.length > 0) {
        vehicle.vehicle_entity_links.forEach((link) => {
          const statusEmoji = link.status === 'active' ? '✓' : '○';
          console.log(`      ${statusEmoji} ${link.entities.name} - ${link.relationship_type} (${link.status})`);
          console.log(`         Início: ${link.start_date} | Fim: ${link.end_date || 'N/A'}`);
        });
      } else {
        console.log('      (Nenhum vínculo encontrado)');
      }
    });

    // Test 3: Fetch vehicles for a specific entity (João Silva)
    console.log('\n\n📋 Test 3: Fetching vehicles for João Silva...');

    const joaoSilva = entities.find(e => e.name === 'João Silva');

    if (joaoSilva) {
      const { data: joaoVehicles, error: joaoError } = await supabase
        .from('vehicle_entity_links')
        .select(`
          *,
          vehicles (
            *,
            brands (brand),
            models (model),
            plates (plate, active)
          )
        `)
        .eq('entity_id', joaoSilva.id)
        .eq('active', true);

      if (joaoError) throw joaoError;

      console.log(`✅ João Silva has ${joaoVehicles.length} vehicle links:\n`);

      joaoVehicles.forEach((link) => {
        const vehicle = link.vehicles;
        const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
        console.log(`   - ${vehicle.brands.brand} ${vehicle.models.model}`);
        console.log(`     Placa: ${activePlate?.plate || 'N/A'}`);
        console.log(`     Tipo: ${link.relationship_type}`);
        console.log(`     Status: ${link.status}`);
      });
    }

    // Test 4: Test AI Agent and IoT Device links
    console.log('\n\n📋 Test 4: Testing AI and IoT entity links...');

    const aiAgent = entities.find(e => e.entity_type === 'ai_agent');
    const iotDevice = entities.find(e => e.entity_type === 'iot_device');

    if (aiAgent) {
      console.log(`\n🤖 AI Agent: ${aiAgent.name}`);
      console.log(`   Model: ${aiAgent.ai_model}`);

      const { data: aiLinks } = await supabase
        .from('vehicle_entity_links')
        .select('*, vehicles (brands (brand), models (model))')
        .eq('entity_id', aiAgent.id)
        .eq('active', true);

      if (aiLinks && aiLinks.length > 0) {
        console.log(`   Linked to ${aiLinks.length} vehicle(s):`);
        aiLinks.forEach(link => {
          console.log(`      - ${link.vehicles.brands.brand} ${link.vehicles.models.model} (${link.relationship_type})`);
        });
      }
    }

    if (iotDevice) {
      console.log(`\n📡 IoT Device: ${iotDevice.name}`);
      console.log(`   Serial: ${iotDevice.device_serial}`);
      console.log(`   Type: ${iotDevice.device_type}`);

      const { data: iotLinks } = await supabase
        .from('vehicle_entity_links')
        .select('*, vehicles (brands (brand), models (model))')
        .eq('entity_id', iotDevice.id)
        .eq('active', true);

      if (iotLinks && iotLinks.length > 0) {
        console.log(`   Linked to ${iotLinks.length} vehicle(s):`);
        iotLinks.forEach(link => {
          console.log(`      - ${link.vehicles.brands.brand} ${link.vehicles.models.model} (${link.relationship_type})`);
        });
      }
    }

    console.log('\n\n✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

testEntityLinks();
