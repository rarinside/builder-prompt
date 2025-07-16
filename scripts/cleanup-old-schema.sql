-- =============================================
-- PARTE 3: LIMPEZA (EXECUTE APÓS CONFIRMAR QUE TUDO FUNCIONA)
-- =============================================

-- ⚠️ CUIDADO: Execute apenas após confirmar que a migração funcionou!

-- No SELF-HOSTED, remover schema antigo:
-- DROP SCHEMA IF EXISTS promptbuilder CASCADE;

-- Verificar se dados foram migrados corretamente:
SELECT 'Prompts migrados:' as tipo, COUNT(*) as quantidade FROM public.prompts
UNION ALL
SELECT 'Assinaturas migradas:' as tipo, COUNT(*) as quantidade FROM public.assinaturas;

-- Verificar se schema antigo ainda existe:
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'promptbuilder';
