-- =============================================
-- SCRIPT DE VERIFICAÇÃO DA MIGRAÇÃO
-- Execute após os scripts de migração
-- =============================================

-- =============================================
-- VERIFICAR SUPABASE HOSPEDADO
-- =============================================
SELECT '=== VERIFICAÇÃO SUPABASE HOSPEDADO ===' as info;

-- 1. Verificar se as tabelas existem
SELECT 
    'Tabelas criadas:' as tipo,
    table_name as nome
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('planos', 'usuarios')
ORDER BY table_name;

-- 2. Verificar planos inseridos
SELECT 
    'Planos disponíveis:' as tipo,
    nome,
    CASE 
        WHEN limite_prompts IS NULL THEN 'Ilimitado'
        ELSE limite_prompts::text
    END as limite,
    CONCAT('R$ ', preco) as preco
FROM public.planos 
ORDER BY preco;

-- 3. Verificar políticas RLS
SELECT 
    'Políticas RLS:' as tipo,
    tablename as tabela,
    policyname as politica
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('planos', 'usuarios');

-- 4. Verificar índices
SELECT 
    'Índices criados:' as tipo,
    indexname as nome,
    tablename as tabela
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('planos', 'usuarios')
  AND indexname LIKE 'idx_%';

-- 5. Verificar triggers
SELECT 
    'Triggers criados:' as tipo,
    trigger_name as nome,
    event_object_table as tabela
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('planos', 'usuarios');

SELECT '=== FIM VERIFICAÇÃO HOSPEDADO ===' as info;
