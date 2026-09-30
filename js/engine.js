/**
 * Sistema de Análise de Crédito Rural - Motor de Decisão (Engine)
 * Versão: 0.1.0 - Versão Base (Produtor Agrícola)
 */

(function (global) {
  'use strict';

  // Margens operacionais estimadas por atividade agrícola
  const ACTIVITY_MARGINS = {
    GRAOS: 0.30,         // Soja / Milho / Trigo
    CAFE: 0.28,          // Cafeicultura
    PECUARIA_CORTE: 0.22,// Pecuária de Corte
    PECUARIA_LEITE: 0.20,// Pecuária Leiteira
    HORTIFRUTI: 0.32,    // Hortifruti
    CANA: 0.25           // Cana-de-Açúcar
  };

  // Taxas referenciais de juros por categoria de produtor (Plano Safra referencial)
  const INTEREST_RATES = {
    PRONAF: 0.05,        // 5% ao ano (Pronaf Custeio/Investimento)
    PRONAMP: 0.08,       // 8% ao ano (Pronamp)
    DEMAIS: 0.12         // 12% ao ano (Recursos Obrigatórios / Livres)
  };

  // Fator de liquidez/ponderação do tipo de garantia
  const GUARANTEE_WEIGHTS = {
    IMOVEL_RURAL: 1.0,   // Hipoteca / Alienação Fiduciária de Terra
    CPR_SAFRA: 0.75,     // Safra futura / CPR Física ou Financeira
    MAQUINARIO: 0.70,    // Tratores, Colheitadeiras
    AVAL: 0.50           // Fiança / Aval pessoal
  };

  /**
   * Avalia uma proposta de crédito rural com base no perfil do produtor e dados financeiros.
   * @param {Object} input - Dados da solicitação
   * @returns {Object} Resultado detalhado da análise
   */
  function evaluateCredit(input) {
    const revenue = Math.max(0, Number(input.annualRevenue) || 0);
    const debts = Math.max(0, Number(input.currentDebts) || 0);
    const requested = Math.max(0, Number(input.requestedAmount) || 0);
    const guaranteeVal = Math.max(0, Number(input.guaranteeValue) || 0);
    const termMonths = Math.max(1, Number(input.termMonths) || 12);
    const area = Math.max(0, Number(input.areaHectares) || 0);
    const activity = input.activity || 'GRAOS';
    const producerType = input.producerType || 'PRONAMP';
    const guaranteeType = input.guaranteeType || 'IMOVEL_RURAL';
    const creditHistory = input.creditHistory || 'BOM';
    const purpose = input.creditPurpose || 'CUSTEIO';

    const reasons = [];
    let score = 0;

    // 1. Margem e Renda Líquida Projetada
    const opMargin = ACTIVITY_MARGINS[activity] || 0.25;
    const projectedNetIncome = revenue * opMargin;

    // 2. Cálculo do Serviço da Dívida Anual Estimado (PMT aproximado)
    const annualRate = INTEREST_RATES[producerType] || 0.09;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = (requested * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    } else {
      monthlyPayment = requested / termMonths;
    }
    const annualInstallment = monthlyPayment * Math.min(termMonths, 12);

    // 3. Indicadores Financeiros
    const debtToIncomeRatio = projectedNetIncome > 0 ? (annualInstallment / projectedNetIncome) * 100 : 100;
    const totalDebt = debts + requested;
    const totalDebtRatio = revenue > 0 ? (totalDebt / revenue) * 100 : 100;
    const guaranteeWeight = GUARANTEE_WEIGHTS[guaranteeType] || 0.6;
    const adjustedGuaranteeValue = guaranteeVal * guaranteeWeight;
    const guaranteeCoverage = requested > 0 ? (adjustedGuaranteeValue / requested) * 100 : 0;
    const nominalLTV = requested > 0 ? (guaranteeVal / requested) * 100 : 0;

    // 4. Avaliação do Histórico de Crédito (Máx 30 pts)
    if (creditHistory === 'EXCELENTE') {
      score += 30;
      reasons.push({ type: 'success', text: 'Histórico cadastral exemplar, sem apontamentos nos órgãos de proteção.' });
    } else if (creditHistory === 'BOM') {
      score += 24;
      reasons.push({ type: 'success', text: 'Histórico de crédito satisfatório e pontualidade habitual.' });
    } else if (creditHistory === 'ATRASO_LEVE') {
      score += 12;
      reasons.push({ type: 'warning', text: 'Apontamento cadastral anterior identificado (necessita comprovação de quitação).' });
    } else {
      score += 0;
      reasons.push({ type: 'danger', text: 'Restrição cadastral ativa relevante (impeditivo para aprovação automática).' });
    }

    // 5. Avaliação da Capacidade de Pagamento / Comprometimento de Margem (Máx 25 pts)
    if (debtToIncomeRatio <= 25) {
      score += 25;
      reasons.push({ type: 'success', text: `Excelente capacidade de pagamento (parcela consome ${debtToIncomeRatio.toFixed(1)}% do lucro operacional líquido).` });
    } else if (debtToIncomeRatio <= 40) {
      score += 18;
      reasons.push({ type: 'success', text: `Capacidade de pagamento adequada (${debtToIncomeRatio.toFixed(1)}% da margem líquida da atividade).` });
    } else if (debtToIncomeRatio <= 55) {
      score += 10;
      reasons.push({ type: 'warning', text: `Comprometimento elevado da margem líquida (${debtToIncomeRatio.toFixed(1)}%). Recomendável carência ou alongamento.` });
    } else {
      score += 0;
      reasons.push({ type: 'danger', text: `Comprometimento crítico da renda da safra (${debtToIncomeRatio.toFixed(1)}% acima do limite prudencial).` });
    }

    // 6. Avaliação da Alavancagem e Endividamento Total (Máx 25 pts)
    if (totalDebtRatio <= 30) {
      score += 25;
      reasons.push({ type: 'success', text: `Baixo endividamento geral (${totalDebtRatio.toFixed(1)}% sobre a receita bruta anual).` });
    } else if (totalDebtRatio <= 50) {
      score += 18;
      reasons.push({ type: 'success', text: `Endividamento equilibrado para o ciclo agrícola (${totalDebtRatio.toFixed(1)}% da receita anual).` });
    } else if (totalDebtRatio <= 70) {
      score += 8;
      reasons.push({ type: 'warning', text: `Nível de alavancagem moderado/alto (${totalDebtRatio.toFixed(1)}%). Requer atenção ao fluxo de caixa.` });
    } else {
      score += 0;
      reasons.push({ type: 'danger', text: `Alavancagem excessiva: Dívida total representa ${totalDebtRatio.toFixed(1)}% da receita bruta anual.` });
    }

    // 7. Avaliação de Garantias e Lastro Real (Máx 20 pts)
    if (guaranteeCoverage >= 130) {
      score += 20;
      reasons.push({ type: 'success', text: `Cobertura robusta de garantia (${guaranteeCoverage.toFixed(0)}% ponderada / ${nominalLTV.toFixed(0)}% nominal).` });
    } else if (guaranteeCoverage >= 100) {
      score += 15;
      reasons.push({ type: 'success', text: `Garantias satisfatórias cobrindo integralmente o risco (${guaranteeCoverage.toFixed(0)}% ponderada).` });
    } else if (guaranteeCoverage >= 70) {
      score += 8;
      reasons.push({ type: 'warning', text: `Cobertura de garantias abaixo da margem prudencial (${guaranteeCoverage.toFixed(0)}%). Recomendado reforço de penhor/aval.` });
    } else {
      score += 0;
      reasons.push({ type: 'danger', text: `Garantias insuficientes para o montante pretendido (${guaranteeCoverage.toFixed(0)}% ponderada).` });
    }

    // 8. Cálculo de Limite Máximo Recomendado
    // Custeio agrícola típico admite até 50% da receita líquida projetada
    const maxAnnualService = projectedNetIncome * 0.45;
    let maxRecommendedCredit = (maxAnnualService * (termMonths / 12)) * (1 / (1 + (annualRate * 0.5)));
    // Teto de garantia (máximo de 80% do valor da garantia ajustada)
    if (guaranteeVal > 0) {
      const maxByGuarantee = adjustedGuaranteeValue * 1.1;
      maxRecommendedCredit = Math.min(maxRecommendedCredit, maxByGuarantee);
    }
    maxRecommendedCredit = Math.max(0, Math.round(maxRecommendedCredit / 5000) * 5000);

    // 9. Classificação de Rating
    let rating = 'E';
    if (score >= 85) rating = 'A';
    else if (score >= 70) rating = 'B';
    else if (score >= 55) rating = 'C';
    else if (score >= 40) rating = 'D';

    // 10. Decisão Final do Motor
    let decision = 'APPROVED';
    let decisionTitle = 'Crédito Pré-Aprovado';
    let decisionSubtitle = 'Proposta consistente com as políticas de crédito agrícola vigentes.';

    if (creditHistory === 'RESTRICAO_GRAVE' || totalDebtRatio > 75 || debtToIncomeRatio > 65) {
      decision = 'REJECTED';
      decisionTitle = 'Crédito Não Recomendado';
      decisionSubtitle = 'A proposta ultrapassou parâmetros regulatórios ou de segurança de risco de crédito.';
    } else if (score < 60 || debtToIncomeRatio > 40 || guaranteeCoverage < 90) {
      decision = 'CONDITIONAL';
      decisionTitle = 'Aprovado com Condicionantes';
      decisionSubtitle = 'A concessão requer reforço de garantias ou ajuste no montante/prazo do financiamento.';
    }

    return {
      decision,
      decisionTitle,
      decisionSubtitle,
      score,
      rating,
      maxRecommendedCredit,
      metrics: {
        debtToIncomeRatio,
        totalDebtRatio,
        guaranteeCoverage,
        nominalLTV,
        annualInstallment,
        projectedNetIncome,
        area
      },
      reasons
    };
  }

  // Exportação para Node / Browser
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateCredit };
  } else {
    global.CreditEngine = { evaluateCredit };
  }
})(typeof window !== 'undefined' ? window : this);
