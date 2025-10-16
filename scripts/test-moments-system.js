require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMomentsSystem() {
  console.log('🧪 Testing Moments System Integration\n');

  try {
    // Test 1: Fetch all moments with details
    console.log('📋 Test 1: Fetching moments with full details...');
    const { data: moments, error: momentsError } = await supabase
      .from('moments')
      .select(`
        *,
        vehicles (
          id,
          brands (brand),
          models (model),
          model_versions (version)
        ),
        entities!moments_entity_id_fkey (
          name,
          entity_type
        ),
        moment_images (
          image_url,
          image_order
        ),
        moment_reactions (
          reaction_type,
          entities!moment_reactions_entity_id_fkey (name)
        ),
        moment_comments (
          comment,
          entities!moment_comments_entity_id_fkey (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (momentsError) throw momentsError;

    console.log(`✅ Found ${moments.length} moments:\n`);

    moments.forEach((moment, index) => {
      console.log(`📸 Momento ${index + 1}:`);
      console.log(`   Veículo: ${moment.vehicles.brands.brand} ${moment.vehicles.models.model}`);
      console.log(`   Postado por: ${moment.entities.name}`);
      console.log(`   Caption: "${moment.caption}"`);
      console.log(`   Tipo: ${moment.type}`);
      console.log(`   Local: ${moment.location || 'N/A'}`);
      console.log(`   Reações: ${moment.moment_reactions.length}`);

      if (moment.moment_reactions.length > 0) {
        const reactionCounts = moment.moment_reactions.reduce((acc, r) => {
          acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
          return acc;
        }, {});
        console.log(`      ${Object.entries(reactionCounts).map(([type, count]) => `${type}: ${count}`).join(', ')}`);
      }

      console.log(`   Comentários: ${moment.moment_comments.length}`);
      if (moment.moment_comments.length > 0) {
        moment.moment_comments.forEach(comment => {
          console.log(`      💬 ${comment.entities.name}: "${comment.comment}"`);
        });
      }

      console.log(`   Imagens: ${moment.moment_images.length}`);
      if (moment.moment_images.length > 0) {
        moment.moment_images.forEach((img, idx) => {
          console.log(`      🖼️  Imagem ${idx + 1}: ${img.image_url}`);
        });
      }
      console.log('');
    });

    // Test 2: Check vehicle images
    console.log('📋 Test 2: Checking vehicle images...');
    const { data: vehicleImages, error: imagesError } = await supabase
      .from('vehicle_images')
      .select(`
        *,
        vehicles (
          brands (brand),
          models (model)
        )
      `)
      .eq('is_primary', true);

    if (imagesError) throw imagesError;

    console.log(`✅ Found ${vehicleImages.length} primary vehicle images:\n`);

    vehicleImages.forEach(img => {
      console.log(`   🚗 ${img.vehicles.brands.brand} ${img.vehicles.models.model}`);
      console.log(`      Primary image: ${img.image_url}`);
    });

    // Test 3: Check storage buckets
    console.log('\n📋 Test 3: Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) throw bucketsError;

    console.log(`✅ Found ${buckets.length} storage buckets:\n`);

    buckets.forEach(bucket => {
      console.log(`   🪣 ${bucket.name}`);
      console.log(`      Public: ${bucket.public}`);
      console.log(`      Created: ${new Date(bucket.created_at).toLocaleString('pt-BR')}`);
    });

    // Test 4: Statistics
    console.log('\n📊 Statistics:\n');

    const { count: momentsCount } = await supabase
      .from('moments')
      .select('*', { count: 'exact', head: true });

    const { count: reactionsCount } = await supabase
      .from('moment_reactions')
      .select('*', { count: 'exact', head: true });

    const { count: commentsCount } = await supabase
      .from('moment_comments')
      .select('*', { count: 'exact', head: true });

    const { count: vehicleImagesCount } = await supabase
      .from('vehicle_images')
      .select('*', { count: 'exact', head: true });

    console.log(`   📸 Total moments: ${momentsCount}`);
    console.log(`   ❤️  Total reactions: ${reactionsCount}`);
    console.log(`   💬 Total comments: ${commentsCount}`);
    console.log(`   🖼️  Total vehicle images: ${vehicleImagesCount}`);

    console.log('\n✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

testMomentsSystem();
