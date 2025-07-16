# 🔄 Guia de Migração - Schema Existente para Nova Arquitetura

## ⚠️ IMPORTANTE: Backup Primeiro!
Antes de executar qualquer script, faça backup completo dos seus dados:

\`\`\`sql
-- No seu Supabase self-hosted atual:
pg_dump -h seu-host -U postgres -d postgres > backup_completo.sql
\`\`\`

## 📋 Checklist de Migração

### ✅ Pré-requisitos
- [ ] Backup completo realizado
- [ ] Supabase hospedado criado e configurado
- [ ] Variáveis de ambiente atualizadas no .env.local
- [ ] Acesso aos dois bancos confirmado

### 🏠 Passo 1: Configurar Supabase Hospedado
Execute no **Supabase Dashboard HOSPEDADO > SQL Editor**:

\`\`\`sql
-- Cole e execute: scripts/migration-plan.sql
\`\`\`

**Resultado esperado:**
- ✅ Tabelas `planos` e `usuarios` criadas
- ✅ Planos padrão inseridos
- ✅ Políticas RLS configuradas
- ✅ Índices criados

### 🏢 Passo 2: Migrar Self-hosted
Execute no **seu Supabase SELF-HOSTED > SQL Editor**:

\`\`\`sql
-- Cole e execute: scripts/selfhosted-migration.sql
\`\`\`

**Resultado esperado:**
- ✅ Dados migrados do schema `promptbuilder` para `public`
- ✅ Tabelas `prompts` e `assinaturas` atualizadas
- ✅ Políticas simplificadas aplicadas

### 🧪 Passo 3: Testar a Migração

1. **Verificar dados migrados:**
\`\`\`sql
-- No self-hosted:
SELECT 'Prompts:' as tabela, COUNT(*) as total FROM public.prompts
UNION ALL
SELECT 'Assinaturas:' as tabela, COUNT(*) as total FROM public.assinaturas;
\`\`\`

2. **Testar autenticação:**
- Criar uma conta nova
- Verificar se o usuário aparece no hospedado
- Criar um prompt e verificar se aparece no self-hosted

3. **Verificar conexões:**
\`\`\`bash
# Testar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_HOSTED_URL
echo $NEXT_PUBLIC_SUPABASE_SELFHOSTED_URL
\`\`\`

### 🧹 Passo 4: Limpeza (Opcional)
**⚠️ Execute apenas após confirmar que tudo funciona!**

\`\`\`sql
-- No self-hosted, após confirmar migração:
-- scripts/cleanup-old-schema.sql
\`\`\`

## 🔧 Principais Mudanças no Schema

### ❌ Removido do Self-hosted:
- Schema `promptbuilder`
- Tabela `usuarios` (movida para hospedado)
- Tabela `planos` (movida para hospedado)
- Views complexas que dependiam de usuários
- Funções que verificavam limites localmente

### ✅ Mantido no Self-hosted:
- Tabela `prompts` (agora em `public`)
- Tabela `assinaturas` (agora em `public`)
- Função `update_expired_subscriptions()`
- Triggers de `updated_at`

### 🆕 Adicionado ao Hospedado:
- Tabela `usuarios` com referência a `auth.users`
- Tabela `planos`
- Políticas RLS para autenticação
- Triggers e funções básicas

## 🚨 Problemas Comuns e Soluções

### Erro: "relation promptbuilder.usuarios does not exist"
**Causa:** Código ainda referencia schema antigo
**Solução:** Atualizar imports para usar novos clientes

### Erro: "permission denied for schema promptbuilder"
**Causa:** Schema antigo ainda sendo usado
**Solução:** Verificar se migração foi executada corretamente

### Erro: "user_id constraint violation"
**Causa:** IDs de usuários não coincidem entre bancos
**Solução:** Recriar usuários ou mapear IDs corretamente

## 📊 Verificação Final

Execute estes comandos para confirmar que tudo está funcionando:

\`\`\`sql
-- No HOSPEDADO:
SELECT 'Usuários:' as tabela, COUNT(*) as total FROM public.usuarios
UNION ALL
SELECT 'Planos:' as tabela, COUNT(*) as total FROM public.planos;

-- No SELF-HOSTED:
SELECT 'Prompts:' as tabela, COUNT(*) as total FROM public.prompts
UNION ALL
SELECT 'Assinaturas:' as tabela, COUNT(*) as total FROM public.assinaturas;
\`\`\`

## 🎯 Próximos Passos

Após a migração bem-sucedida:

1. **Atualizar aplicação** com novos clientes Supabase
2. **Testar fluxo completo** de registro → login → criação de prompt
3. **Monitorar logs** para identificar possíveis problemas
4. **Documentar** mudanças para a equipe
5. **Fazer backup** da nova estrutura

## 🆘 Rollback (Se Necessário)

Se algo der errado, você pode voltar ao estado anterior:

\`\`\`sql
-- Restaurar backup completo:
psql -h seu-host -U postgres -d postgres < backup_completo.sql
\`\`\`

E reverter as mudanças no código para usar apenas o self-hosted.
