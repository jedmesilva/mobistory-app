require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkVehicleNames() {
  console.log('🔍 Verificando Nomes dos Veículos\n');

  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      brands (brand),
      models (model),
      model_versions (version)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro:', error);
    return;
  }

  console.log('📊 Dados no Supabase:\n');
  data.forEach(v => {
    console.log(`Veículo ID: ${v.id}`);
    console.log(`  Brand: ${v.brands.brand}`);
    console.log(`  Model: ${v.models.model}`);
    console.log(`  Version: ${v.model_versions?.version || 'null'}`);
    console.log(`  ✅ Nome CORRETO deveria ser: "${v.brands.brand} ${v.models.model} ${v.model_versions?.version || ''}"`);
    console.log('');
  });

  console.log('\n📱 Como está sendo montado no Frontend (vehicles-link-list.tsx):');
  console.log('');

  data.forEach(v => {
    const brand = v.brands.brand;
    const name = v.models.model;
    const model = v.model_versions?.version || '';

    console.log(`Veículo: ${v.brands.brand} ${v.models.model}`);
    console.log(`  brand: "${brand}" (usado como marca)`);
    console.log(`  name: "${name}" (usado como nome principal)`);
    console.log(`  model: "${model}" (usado como versão/modelo)`);
    console.log(`  ❌ Resultado no card: "${name} ${model}"`);
    console.log(`  ✅ Deveria ser: "${brand} ${name} ${model}"`);
    console.log('');
  });
}

checkVehicleNames();
