# Sistema de Análise de Crédito Rural

Sistema inteligente para avaliação de risco e concessão de crédito para produtores agrícolas (Pronaf, Pronamp e Grandes Produtores).

## 🌾 Funcionalidades

- **Avaliação Cadastral e de Perfil**: Análise do perfil da propriedade, atividade agrícola e histórico cadastral.
- **Motor de Risco Rural**:
  - Comprometimento de renda operacional líquida.
  - Indicador de endividamento total sobre a receita bruta anual.
  - Análise ponderada de garantias reais e pessoais (Alienação fiduciária, CPR Safra, Maquinário e Aval).
  - Cálculo de Score de Risco (0 a 100) e classificação de rating (A até E).
  - Determinação de limite máximo de crédito recomendado.
- **Parecer Automatizado**: Aprovado, Aprovado com Condicionantes ou Reprovado com detalhamento das justificativas.

## 🚀 Como Executar

Abra o arquivo `index.html` diretamente em seu navegador ou utilize qualquer servidor web local:

```bash
# Exemplo com npx serve ou Live Server
npx serve .
```

Pronto para deploy contínuo na plataforma [Vercel](https://vercel.com).
