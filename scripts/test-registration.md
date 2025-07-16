# 🧪 Teste de Cadastro - Pós Migração

## 🚀 Como Testar o Cadastro

### 1. **Acesse a página de registro:**
\`\`\`
http://localhost:3000/auth/register
\`\`\`

### 2. **Preencha os dados:**
- Nome: Seu Nome
- Email: teste@exemplo.com
- Senha: 123456 (mínimo 6 caracteres)
- Confirmar senha: 123456
- Plano: Free (padrão)

### 3. **Clique em "Criar conta gratuita"**

## ✅ **Fluxo Esperado:**

1. **Frontend** → Envia dados para `/api/auth/register`
2. **API** → Cria usuário no Supabase hospedado (auth)
3. **API** → Cria perfil na tabela `usuarios` (hospedado)
4. **API** → Se plano pago, cria assinatura (self-hosted)
5. **Frontend** → Faz login automático
6. **Redirect** → Dashboard ou builder

## 🔍 **Como Verificar se Funcionou:**

### No Supabase Hospedado:
\`\`\`sql
-- Verificar se usuário foi criado
SELECT 
    u.email,
    u.nome,
    p.nome as plano
FROM public.usuarios u
JOIN public.planos p ON u.plano_id = p.id
ORDER BY u.created_at DESC
LIMIT 5;
\`\`\`

### No Self-hosted (se plano pago):
\`\`\`sql
-- Verificar assinatura criada
SELECT 
    user_id,
    plano_id,
    status,
    data_vencimento
FROM public.assinaturas
ORDER BY created_at DESC
LIMIT 5;
\`\`\`

## ❌ **Possíveis Erros e Soluções:**

### 1. **"Banco de dados não configurado"**
**Causa:** Tabelas não existem no hospedado
**Solução:** Execute `migration-plan-fixed.sql` novamente

### 2. **"Email logins are disabled"**
**Causa:** Auth por email desabilitado no Supabase
**Solução:** 
1. Acesse Supabase Dashboard HOSPEDADO
2. Authentication > Settings
3. Habilite "Email" em Auth Providers

### 3. **"Invalid login credentials"**
**Causa:** Erro na criação do usuário
**Solução:** Verificar logs da API

### 4. **"Erro ao criar perfil do usuário"**
**Causa:** Problema na tabela usuarios
**Solução:** Verificar se foreign key para planos existe

## 🔧 **Debug do Cadastro:**

### Verificar variáveis de ambiente:
\`\`\`bash
# .env.local deve ter:
NEXT_PUBLIC_SUPABASE_HOSTED_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_HOSTED_ANON_KEY=sua_chave_anonima
SUPABASE_HOSTED_SERVICE_ROLE_KEY=sua_chave_servico
\`\`\`

### Verificar logs no terminal:
\`\`\`bash
npm run dev
# Observe os logs quando fizer o cadastro
\`\`\`

### Verificar Network tab no navegador:
1. F12 → Network
2. Fazer cadastro
3. Verificar se `/api/auth/register` retorna 200

## 🎯 **Teste Completo:**

1. **Cadastro** → Criar conta
2. **Login** → Entrar com a conta criada  
3. **Builder** → Ir para `/builder`
4. **Criar Prompt** → Testar criação de prompt
5. **Dashboard** → Verificar se prompt aparece

## 📱 **Interface de Cadastro:**

A página já está pronta em `/auth/register` com:
- ✅ Formulário responsivo
- ✅ Validação de campos
- ✅ Seleção de planos
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Redirecionamento automático
