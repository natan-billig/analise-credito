# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.1.0] - Versão Base (Produtor Agrícola) - 2026-09-30

### Adicionado
- **Estruturação do Projeto**:
  - Arquitetura estática leve pronta para deploy no Vercel (`vercel.json`).
  - Interface responsiva com painéis para entrada de dados cadastrais e financeiros do produtor (`index.html`).
  - Ignorados arquivos locais e segredos no repositório (`.gitignore`).
- **Motor de Decisão de Crédito Rural (`js/engine.js`)**:
  - Cálculo de margem operacional por cultura/atividade (grãos, cafeicultura, pecuária, cana, hortifruti).
  - Cálculo do serviço da dívida anual e comprometimento de receita líquida (DTI agrícola).
  - Análise de alavancagem total (dívidas preexistentes + crédito pretendido vs. faturamento anual).
  - Ponderação e índice de cobertura real de garantias (LTV: alienação fiduciária, CPR safra, maquinário, aval).
  - Sistema de pontuação (Score 0-100) e classificação de rating de risco (A, B, C, D, E).
  - Pareceres automatizados: Aprovado, Aprovado com Condicionantes e Reprovado.
  - Estimativa de limite de crédito máximo suportado.
- **Controlador e Interação (`js/app.js`)**:
  - Validação e sincronização de dados do formulário com o motor de análise.
  - Formatação monetária padrão BRL e percentual.
  - Indicadores visuais de risco, badges de saúde financeira e justificativas detalhadas.
  - Simulações dinâmicas de múltiplos perfis (Pronaf, Pronamp, Grande Produtor).
