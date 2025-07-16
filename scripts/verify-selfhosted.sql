-- =============================================
-- VERIFICAR SUPABASE SELF-HOSTED
-- Execute no seu Supabase self-hosted
-- =============================================

SELECT '=== VERIFICAÇÃO SUPABASE SELF-HOSTED ===' as info;

-- 1. Verificar se as tabelas existem no schema public
SELECT 
    'Tabelas migradas:' as tipo,
    table_name as nome,
    table_schema as schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('prompts', 'assinaturas')
ORDER BY table_name;

-- 2. Verificar se dados foram migrados
SELECT 'Dados migrados:' as tipo, 'prompts' as tabela, COUNT(*) as quantidade 
FROM public.prompts
UNION ALL
SELECT 'Dados migrados:' as tipo, 'assinaturas' as tabela, COUNT(*) as quantidade 
FROM public.assinaturas;

-- 3. Verificar se schema antigo ainda existe
SELECT 
    'Schemas existentes:' as tipo,
    schema_name as nome
FROM information_schema.schemata 
WHERE schema_name IN ('public', 'promptbuilder')
ORDER BY schema_name;

-- 4. Verificar políticas RLS
SELECT 
    'Políticas RLS:' as tipo,
    tablename as tabela,
    policyname as politica
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('prompts', 'assinaturas');

-- 5. Verificar índices
SELECT 
    'Índices criados:' as tipo,
    indexname as nome,
    tablename as tabela
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('prompts', 'assinaturas')
  AND indexname LIKE 'idx_%';

-- 6. Verificar se dados antigos ainda existem no schema promptbuilder
SELECT 
    'Dados no schema antigo:' as tipo,
    'promptbuilder.prompts' as tabela,
    COUNT(*) as quantidade
FROM promptbuilder.prompts
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'promptbuilder' AND table_name = 'prompts')
UNION ALL
SELECT 
    'Dados no schema antigo:' as tipo,
    'promptbuilder.assinaturas' as tabela,
    COUNT(*) as quantidade
FROM promptbuilder.assinaturas
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'promptbuilder' AND table_name = 'assinaturas');

SELECT '=== FIM VERIFICAÇÃO SELF-HOSTED ===' as info;
