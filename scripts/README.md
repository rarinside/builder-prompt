# Scripts do Banco de Dados

Este diretório contém os scripts SQL para configuração e manutenção do banco de dados do R.I.C.A.R.D.O Prompt Builder.

## ⚠️ CONFIGURAÇÃO OBRIGATÓRIA

**Antes de usar o sistema, você precisa configurar o Supabase:**

### 1. 🔧 Configurar Autenticação
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication > Settings**
4. Em **Auth Providers**, certifique-se que **Email** está **HABILITADO**
5. Em **Email Auth**, configure:
   - ✅ Enable email confirmations: **DESABILITADO** (para desenvolvimento)
   - ✅ Enable email change confirmations: **DESABILITADO** (para desenvolvimento)
6. Clique em **Save**

### 2. 🗄️ Configurar Banco de Dados
1. No Supabase Dashboard, vá em **SQL Editor**
2. Cole e execute o conteúdo do arquivo `setup-database.sql`
3. Verifique se aparece: "Schema e tabelas criados com sucesso!"

## Arquivos

### `setup-database.sql` ⭐ **EXECUTE PRIMEIRO**
Script inicial que cria:
- Schema `promptbuilder`
- Tabelas: `planos`, `usuarios`, `assinaturas`, `prompts`
- Planos padrão (Free, Pro, Alunos)
- Políticas de segurança (RLS)

### `supabase-schema.sql`
Schema completo com funcionalidades avançadas:
- Triggers automáticos
- Views otimizadas
- Funções auxiliares
- Índices para performance

## Como usar

### 1. Configuração inicial (OBRIGATÓRIO)
\`\`\`sql
-- Execute no Supabase SQL Editor
\i scripts/setup-database.sql
\`\`\`

### 2. Verificar instalação
\`\`\`sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'promptbuilder';

-- Verificar planos padrão
SELECT * FROM promptbuilder.planos;
\`\`\`

### 3. Configuração avançada (opcional)
\`\`\`sql
-- Para recursos avançados, execute também:
\i scripts/supabase-schema.sql
\`\`\`

## Troubleshooting

### ❌ Erro: "Email logins are disabled"
**Causa:** Login por email não está habilitado no Supabase
**Solução:**
1. Acesse Supabase Dashboard > Authentication > Settings
2. Habilite "Email" em Auth Providers
3. Desabilite confirmações de email (para desenvolvimento)
4. Salve as configurações

### ❌ Erro: "relation promptbuilder.planos does not exist"
**Causa:** Script do banco não foi executado
**Solução:** Execute o script `setup-database.sql` primeiro.

### ❌ Erro: "schema promptbuilder does not exist"
**Causa:** Permissões insuficientes ou script não executado
**Solução:** Execute os scripts como usuário administrador no Supabase.

### ❌ Erro: "Invalid login credentials"
**Causa:** Email/senha incorretos ou usuário não existe
**Solução:** Verifique as credenciais ou crie uma nova conta.

### ❌ Erro: "Email not confirmed"
**Causa:** Confirmação de email está habilitada mas não foi confirmada
**Solução:** 
1. Desabilite confirmação de email no Supabase (recomendado para desenvolvimento)
2. Ou confirme o email através do link enviado

## Configuração Recomendada para Desenvolvimento

### Supabase Authentication Settings:
\`\`\`
✅ Enable email confirmations: DESABILITADO
✅ Enable email change confirmations: DESABILITADO  
✅ Enable phone confirmations: DESABILITADO
✅ Email Auth Provider: HABILITADO
\`\`\`

### Variáveis de Ambiente (.env.local):
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
\`\`\`

## Estrutura de Planos

| Plano | Limite Prompts | Preço | Descrição |
|-------|----------------|-------|-----------|
| Free | 3 | R$ 0,00 | Plano gratuito |
| Pro | Ilimitado | R$ 199,00 | Plano profissional |
| Alunos | Ilimitado | R$ 0,00 | Para alunos do curso |

## Status do Banco

Para verificar se tudo está funcionando:

\`\`\`sql
-- Verificar schema
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'promptbuilder';

-- Verificar tabelas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'promptbuilder';

-- Verificar planos
SELECT nome, limite_prompts, preco FROM promptbuilder.planos;
\`\`\`

## 🆘 Precisa de Ajuda?

Se ainda estiver com problemas:

1. **Verifique as configurações do Supabase** (Authentication > Settings)
2. **Execute o script SQL** completo no SQL Editor
3. **Confirme as variáveis de ambiente** no arquivo .env.local
4. **Teste com uma conta nova** para verificar o fluxo completo

### Links Úteis:
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuração de Email Auth](https://supabase.com/docs/guides/auth/auth-email)
