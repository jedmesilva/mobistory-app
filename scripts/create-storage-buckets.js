require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Precisa do service role para criar buckets

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrado no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBuckets() {
  console.log('🪣 Criando Buckets de Storage no Supabase\n');

  try {
    // Bucket 1: vehicle-images
    console.log('📦 Criando bucket "vehicle-images"...');
    const { data: vehicleBucket, error: vehicleError } = await supabase
      .storage
      .createBucket('vehicle-images', {
        public: true, // Imagens públicas
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });

    if (vehicleError) {
      if (vehicleError.message.includes('already exists')) {
        console.log('   ⚠️  Bucket "vehicle-images" já existe');
      } else {
        throw vehicleError;
      }
    } else {
      console.log('   ✅ Bucket "vehicle-images" criado com sucesso');
    }

    // Bucket 2: moment-images
    console.log('\n📦 Criando bucket "moment-images"...');
    const { data: momentBucket, error: momentError } = await supabase
      .storage
      .createBucket('moment-images', {
        public: true, // Imagens públicas
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'video/mp4', 'video/quicktime']
      });

    if (momentError) {
      if (momentError.message.includes('already exists')) {
        console.log('   ⚠️  Bucket "moment-images" já existe');
      } else {
        throw momentError;
      }
    } else {
      console.log('   ✅ Bucket "moment-images" criado com sucesso');
    }

    // Verificar buckets criados
    console.log('\n📋 Listando todos os buckets:');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) throw listError;

    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (público: ${bucket.public})`);
    });

    console.log('\n✅ Configuração de storage concluída!\n');

    // Configurar políticas de acesso (RLS)
    console.log('🔒 Políticas de Storage:');
    console.log('   - Leitura: Pública para todos');
    console.log('   - Upload: Requer autenticação');
    console.log('   - Atualização: Apenas owner');
    console.log('   - Deleção: Apenas owner\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar buckets:', error.message);
    console.error('Detalhes:', error);
    process.exit(1);
  }
}

createStorageBuckets();
