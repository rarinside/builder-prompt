-- Schema PromptBuilder para Supabase
-- Criação do esquema
CREATE SCHEMA IF NOT EXISTS promptbuilder;

-- Habilitar extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA PLANOS
-- =============================================
CREATE TABLE promptbuilder.planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL UNIQUE,
    limite_prompts INTEGER, -- NULL significa ilimitado
    preco DECIMAL(10,2) DEFAULT 0.00,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA USUARIOS
-- =============================================
CREATE TABLE promptbuilder.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    plano_id UUID REFERENCES promptbuilder.planos(id) NOT NULL,
    email_verificado BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA ASSINATURAS
-- =============================================
CREATE TABLE promptbuilder.assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES promptbuilder.usuarios(id) ON DELETE CASCADE NOT NULL,
    plano_id UUID REFERENCES promptbuilder.planos(id) NOT NULL,
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','pendente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA PROMPTS
-- =============================================
CREATE TABLE promptbuilder.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES promptbuilder.usuarios(id) ON DELETE CASCADE NOT NULL,
    prompt_original TEXT NOT NULL,
    prompt_sugerido TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_usuarios_auth_id ON promptbuilder.usuarios(auth_id);
CREATE INDEX idx_usuarios_email ON promptbuilder.usuarios(email);
CREATE INDEX idx_usuarios_plano_id ON promptbuilder.usuarios(plano_id);
CREATE INDEX idx_assinaturas_user_id ON promptbuilder.assinaturas(user_id);
CREATE INDEX idx_assinaturas_status ON promptbuilder.assinaturas(status);
CREATE INDEX idx_assinaturas_vencimento ON promptbuilder.assinaturas(data_vencimento);
CREATE INDEX idx_prompts_user_id ON promptbuilder.prompts(user_id);
CREATE INDEX idx_prompts_created_at ON promptbuilder.prompts(created_at);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION promptbuilder.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := timezone('utc', now());
    RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================
CREATE TRIGGER update_planos_updated_at
    BEFORE UPDATE ON promptbuilder.planos
    FOR EACH ROW EXECUTE FUNCTION promptbuilder.update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON promptbuilder.usuarios
    FOR EACH ROW EXECUTE FUNCTION promptbuilder.update_updated_at_column();

CREATE TRIGGER update_assinaturas_updated_at
    BEFORE UPDATE ON promptbuilder.assinaturas
    FOR EACH ROW EXECUTE FUNCTION promptbuilder.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON promptbuilder.prompts
    FOR EACH ROW EXECUTE FUNCTION promptbuilder.update_updated_at_column();

-- =============================================
-- FUNÇÃO PARA VERIFICAR LIMITE DE PROMPTS
-- =============================================
CREATE OR REPLACE FUNCTION promptbuilder.check_prompt_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    user_plan_limit       INTEGER;
    current_prompts_count INTEGER;
BEGIN
    SELECT p.limite_prompts INTO user_plan_limit
    FROM promptbuilder.usuarios u
    JOIN promptbuilder.planos  p ON u.plano_id = p.id
    WHERE u.id = NEW.user_id;

    IF user_plan_limit IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*) INTO current_prompts_count
    FROM promptbuilder.prompts
    WHERE user_id = NEW.user_id
      AND ativo   = true;

    IF current_prompts_count >= user_plan_limit THEN
        RAISE EXCEPTION 'Limite de prompts excedido para este plano. Limite: %', user_plan_limit;
    END IF;

    RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGER PARA VERIFICAR LIMITE DE PROMPTS
-- =============================================
CREATE TRIGGER check_prompt_limit_trigger
    BEFORE INSERT ON promptbuilder.prompts
    FOR EACH ROW EXECUTE FUNCTION promptbuilder.check_prompt_limit();

-- =============================================
-- FUNÇÃO PARA VERIFICAR ASSINATURA ATIVA
-- =============================================
CREATE OR REPLACE FUNCTION promptbuilder.has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    active_subscription_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_subscription_count
    FROM promptbuilder.assinaturas
    WHERE user_id       = user_uuid
      AND status        = 'ativa'
      AND data_vencimento >= CURRENT_DATE;

    RETURN active_subscription_count > 0;
END;
$$;

-- =============================================
-- FUNÇÃO PARA ATUALIZAR STATUS DE ASSINATURAS EXPIRADAS
-- =============================================
CREATE OR REPLACE FUNCTION promptbuilder.update_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE promptbuilder.assinaturas
    SET status = 'expirada'
    WHERE status = 'ativa'
      AND data_vencimento < CURRENT_DATE;
END;
$$;

-- =============================================
-- VIEW PARA INFORMAÇÕES COMPLETAS DO USUÁRIO
-- =============================================
CREATE OR REPLACE VIEW promptbuilder.usuarios_completos AS
SELECT
    u.id,
    u.auth_id,
    u.nome,
    u.email,
    u.email_verificado,
    u.ativo,
    u.created_at,
    u.updated_at,
    p.nome           AS plano_nome,
    p.limite_prompts,
    p.preco          AS plano_preco,
    CASE WHEN promptbuilder.has_active_subscription(u.id) THEN true ELSE false END AS tem_assinatura_ativa,
    (SELECT COUNT(*) FROM promptbuilder.prompts WHERE user_id = u.id AND ativo = true) AS prompts_utilizados
FROM promptbuilder.usuarios u
JOIN promptbuilder.planos p ON u.plano_id = p.id;

-- =============================================
-- INSERIR PLANOS PADRÃO
-- =============================================
INSERT INTO promptbuilder.planos (nome, limite_prompts, preco, descricao) VALUES 
('Free',   3,    0.00, 'Plano gratuito com limite de 3 prompts'),
('Pro',    NULL, 199.00, 'Plano profissional com prompts ilimitados'),
('Alunos', NULL,   0.00, 'Plano para alunos com acesso completo');

-- =============================================
-- POLÍTICAS RLS
-- =============================================
ALTER TABLE promptbuilder.usuarios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.prompts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.assinaturas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.planos        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON promptbuilder.usuarios
  FOR ALL USING (auth.uid() = auth_id);

CREATE POLICY "Usuarios podem ver apenas seus próprios prompts"
  ON promptbuilder.prompts
  FOR ALL USING (
    user_id IN (
      SELECT id FROM promptbuilder.usuarios WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem ver apenas suas próprias assinaturas"
  ON promptbuilder.assinaturas
  FOR ALL USING (
    user_id IN (
      SELECT id FROM promptbuilder.usuarios WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ler os planos"
  ON promptbuilder.planos
  FOR SELECT USING (true);

-- =============================================
-- VIEW PARA LISTAGEM DE PROMPTS DO USUÁRIO
-- =============================================
CREATE OR REPLACE VIEW promptbuilder.prompts_usuario AS
SELECT
    p.id,
    p.prompt_original,
    p.prompt_sugerido,
    p.ativo,
    p.created_at,
    p.updated_at,
    u.nome           AS usuario_nome,
    u.email          AS usuario_email,
    pl.nome          AS plano_nome,
    pl.limite_prompts,
    TO_CHAR(p.created_at,   'DD/MM/YYYY HH24:MI') AS data_criacao_formatada,
    TO_CHAR(p.updated_at,   'DD/MM/YYYY HH24:MI') AS data_atualizacao_formatada,
    CASE WHEN p.ativo THEN 'Ativo' ELSE 'Inativo' END AS status_prompt,
    LENGTH(p.prompt_original) AS caracteres_original,
    LENGTH(p.prompt_sugerido)  AS caracteres_sugerido,
    CASE WHEN p.created_at >= CURRENT_DATE THEN true ELSE false END AS criado_hoje,
    ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at DESC) AS posicao
FROM promptbuilder.prompts p
JOIN promptbuilder.usuarios u ON p.user_id = u.id
JOIN promptbuilder.planos   pl ON u.plano_id = pl.id
WHERE p.ativo
ORDER BY p.created_at DESC;

-- =============================================
-- VIEW PARA DASHBOARD/ESTATÍSTICAS DO USUÁRIO
-- =============================================
CREATE OR REPLACE VIEW promptbuilder.dashboard_usuario AS
SELECT
    u.id             AS user_id,
    u.nome,
    u.email,
    pl.nome          AS plano_nome,
    pl.limite_prompts,
    COUNT(p.id)                        AS total_prompts,
    COUNT(CASE WHEN p.created_at >= CURRENT_DATE THEN 1 END)                         AS prompts_hoje,
    COUNT(CASE WHEN p.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END)     AS prompts_semana,
    COUNT(CASE WHEN p.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END)    AS prompts_mes,
    MAX(p.created_at)   AS ultimo_prompt_criado,
    CASE WHEN pl.limite_prompts IS NULL THEN 'Ilimitado'
         ELSE CONCAT(COUNT(p.id), '/', pl.limite_prompts)
    END AS uso_limite,
    CASE WHEN pl.limite_prompts IS NULL THEN NULL
         ELSE ROUND((COUNT(p.id)::DECIMAL / pl.limite_prompts) * 100, 2)
    END AS percentual_usado,
    CASE WHEN promptbuilder.has_active_subscription(u.id) THEN 'Ativa' ELSE 'Inativa' END AS status_assinatura,
    (SELECT data_vencimento 
     FROM promptbuilder.assinaturas 
     WHERE user_id = u.id 
       AND status  = 'ativa' 
     ORDER BY data_vencimento DESC 
     LIMIT 1
    ) AS vencimento_assinatura
FROM promptbuilder.usuarios u
JOIN promptbuilder.planos   pl ON u.plano_id = pl.id
LEFT JOIN promptbuilder.prompts p ON u.id = p.user_id AND p.ativo
GROUP BY u.id, u.nome, u.email, pl.nome, pl.limite_prompts;

-- =============================================
-- FUNÇÃO PARA BUSCAR PROMPTS COM FILTROS
-- =============================================
CREATE OR REPLACE FUNCTION promptbuilder.buscar_prompts_usuario(
    user_uuid      UUID,
    busca_texto    TEXT    DEFAULT NULL,
    limite         INTEGER DEFAULT 50,
    offset_valor   INTEGER DEFAULT 0,
    ordenar_por    VARCHAR DEFAULT 'created_at',
    ordem          VARCHAR DEFAULT 'DESC'
)
RETURNS TABLE (
    id                      UUID,
    prompt_original         TEXT,
    prompt_sugerido         TEXT,
    created_at              TIMESTAMP WITH TIME ZONE,
    updated_at              TIMESTAMP WITH TIME ZONE,
    data_criacao_formatada  TEXT,
    caracteres_original     INTEGER,
    caracteres_sugerido     INTEGER,
    total_registros         BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.prompt_original,
        p.prompt_sugerido,
        p.created_at,
        p.updated_at,
        TO_CHAR(p.created_at, 'DD/MM/YYYY HH24:MI') AS data_criacao_formatada,
        LENGTH(p.prompt_original)            AS caracteres_original,
        LENGTH(p.prompt_sugerido)            AS caracteres_sugerido,
        COUNT(*) OVER()                      AS total_registros
    FROM promptbuilder.prompts p
    WHERE p.user_id = user_uuid
      AND p.ativo
      AND (
        busca_texto IS NULL
        OR p.prompt_original ILIKE '%' || busca_texto || '%'
        OR p.prompt_sugerido ILIKE '%' || busca_texto || '%'
      )
    ORDER BY
      CASE WHEN ordenar_por = 'created_at' AND ordem = 'DESC' THEN p.created_at END DESC,
      CASE WHEN ordenar_por = 'created_at' AND ordem = 'ASC'  THEN p.created_at END ASC,
      CASE WHEN ordenar_por = 'updated_at' AND ordem = 'DESC' THEN p.updated_at END DESC,
      CASE WHEN ordenar_por = 'updated_at' AND ordem = 'ASC'  THEN p.updated_at END ASC
    LIMIT limite
    OFFSET offset_valor;
END;
$$;

-- =============================================
-- Comentários Finais e Exemplos de Uso
-- =============================================
COMMENT ON SCHEMA promptbuilder IS 'Schema para o sistema PromptBuilder';
COMMENT ON TABLE promptbuilder.planos        IS 'Tabela de planos disponíveis no sistema';
COMMENT ON TABLE promptbuilder.usuarios      IS 'Tabela de usuários do sistema';
COMMENT ON TABLE promptbuilder.assinaturas   IS 'Tabela de assinaturas dos usuários';
COMMENT ON TABLE promptbuilder.prompts       IS 'Tabela de prompts criados pelos usuários';
COMMENT ON FUNCTION promptbuilder.check_prompt_limit() IS 'Verifica limite de prompts antes da inserção';
COMMENT ON FUNCTION promptbuilder.has_active_subscription(UUID) IS 'Verifica se usuário tem assinatura ativa';
COMMENT ON FUNCTION promptbuilder.update_expired_subscriptions() IS 'Atualiza status de assinaturas expiradas';
COMMENT ON VIEW promptbuilder.usuarios_completos    IS 'Visão consolidada dos usuários';
COMMENT ON VIEW promptbuilder.prompts_usuario       IS 'Visão de listagem de prompts do usuário';
COMMENT ON VIEW promptbuilder.dashboard_usuario     IS 'Visão de estatísticas do dashboard do usuário';
