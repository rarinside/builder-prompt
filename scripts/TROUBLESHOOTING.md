# 🔧 Troubleshooting - Migração de Schema

## ❌ Problemas Comuns e Soluções

### 1. **Erro: "policy already exists"**
\`\`\`
ERROR: 42710: policy "Usuarios podem ver apenas seus próprios dados" for table "usuarios" already exists
\`\`\`

**✅ Solução:**
Execute o script corrigido `migration-plan-fixed.sql` que remove políticas existentes antes de criar novas.

### 2. **Erro: "relation already exists"**
\`\`\`
ERROR: relation "public.usuarios" already exists
\`\`\`

**✅ Solução:**
Normal! O script usa `CREATE TABLE IF NOT EXISTS`, então pode ser executado múltiplas vezes.

### 3. **Erro: "duplicate key value violates unique constraint"**
\`\`\`
ERROR: duplicate key value violates unique constraint "planos_nome_key"
\`\`\`

**✅ Solução:**
Os planos já existem. Execute a verificação:
\`\`\`sql
SELECT * FROM public.planos;
\`\`\`

### 4. **Erro: "permission denied for schema promptbuilder"**
\`\`\`
ERROR: permission denied for schema promptbuilder
\`\`\`

**✅ Solução:**
Você está tentando acessar o schema antigo. Use:
\`\`\`sql
SELECT * FROM public.prompts; -- ✅ Correto
-- Em vez de:
SELECT * FROM promptbuilder.prompts; -- ❌ Schema antigo
\`\`\`

### 5. **Erro: "function update_updated_at_column() already exists"**
\`\`\`
ERROR: function update_updated_at_column() already exists
\`\`\`

**✅ Solução:**
Use `CREATE OR REPLACE FUNCTION` (já corrigido no script).

## 🔍 Como Verificar se a Migração Funcionou

### No Supabase Hospedado:
\`\`\`sql
-- Execute: scripts/verify-migration.sql
\`\`\`

### No Self-hosted:
\`\`\`sql
-- Execute: scripts/verify-selfhosted.sql
\`\`\`

## 🚨 Sinais de Problemas

### ❌ Problemas no Hospedado:
- Tabelas `planos` ou `usuarios` não existem
- Planos padrão não foram inseridos
- Políticas RLS não estão ativas
- Não consegue criar usuários via auth

### ❌ Problemas no Self-hosted:
- Dados não foram migrados do schema `promptbuilder`
- Tabelas `prompts` ou `assinaturas` vazias
- Schema `promptbuilder` ainda sendo usado pelo código
- Referências quebradas entre user_id

## 🔧 Scripts de Correção Rápida

### Recriar Políticas RLS:
\`\`\`sql
-- No hospedado:
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Todos podem ler os planos" ON public.planos;

CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON public.usuarios FOR ALL USING (auth.uid() = auth_id);

CREATE POLICY "Todos podem ler os planos"
  ON public.planos FOR SELECT USING (true);
\`\`\`

### Verificar Migração de Dados:
\`\`\`sql
-- No self-hosted:
-- Comparar dados entre schemas
SELECT 
    'promptbuilder' as schema, COUNT(*) as prompts 
FROM promptbuilder.prompts 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'promptbuilder')
UNION ALL
SELECT 
    'public' as schema, COUNT(*) as prompts 
FROM public.prompts;
\`\`\`

### Forçar Migração de Dados:
\`\`\`sql
-- No self-hosted, se dados não migraram:
INSERT INTO public.prompts (id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at)
SELECT id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at
FROM promptbuilder.prompts
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.assinaturas (id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at)
SELECT id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at
FROM promptbuilder.assinaturas
ON CONFLICT (id) DO NOTHING;
\`\`\`

## 📊 Checklist de Verificação

### ✅ Hospedado:
- [ ] Tabela `planos` existe e tem 3 registros
- [ ] Tabela `usuarios` existe e está vazia (normal)
- [ ] Políticas RLS estão ativas
- [ ] Índices foram criados
- [ ] Triggers funcionam

### ✅ Self-hosted:
- [ ] Dados migrados para `public.prompts`
- [ ] Dados migrados para `public.assinaturas`
- [ ] Políticas RLS simplificadas ativas
- [ ] Índices criados
- [ ] Schema `promptbuilder` pode ser removido

## 🆘 Rollback de Emergência

Se algo der muito errado:

\`\`\`sql
-- 1. Parar aplicação
-- 2. Restaurar backup:
psql -h seu-host -U postgres -d postgres < backup_completo.sql

-- 3. Reverter código para usar apenas self-hosted
-- 4. Investigar problema
-- 5. Tentar migração novamente
\`\`\`

## 📞 Próximos Passos

Após resolver os problemas:

1. **Testar autenticação** - criar conta nova
2. **Testar criação de prompt** - verificar se salva no self-hosted
3. **Verificar logs** da aplicação
4. **Atualizar variáveis de ambiente**
5. **Documentar problemas encontrados**
