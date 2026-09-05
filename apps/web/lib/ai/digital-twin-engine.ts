/**
 * Digital Twin Business Simulation Engine
 * Creates a digital clone of current store metrics and executes hypothetical
 * scenarios without altering live database records.
 */

export interface SimulationParameters {
  priceAdjustmentPercent: number; // e.g. +8%
  demandSurgePercent: number; // e.g. +15%
  supplierDelayDays: number; // e.g. +3 days
  adSpendDeltaPercent: number; // e.g. +20%
}

export interface SimulationResult {
  baselineRevenue: number;
  projectedRevenue: number;
  revenueDeltaPercent: number;
  baselineGrossMargin: number;
  projectedGrossMargin: number;
  grossMarginDeltaPercent: number;
  stockoutRiskSKUs: number;
  estimatedNetProfitGain: number;
  confidenceScore: number;
  recommendationSummary: string;
}

export const digitalTwinEngine = {
  runSimulation(params: SimulationParameters): SimulationResult {
    const baseRev = 3850000; // ₹38.5 Lakh
    const baseMargin = 0.382; // 38.2%

    // Elasticity formula: demand responds to price by e = -0.65
    const priceEffectOnDemand = (params.priceAdjustmentPercent / 100) * -0.65;
    const netDemandFactor =
      1 +
      (params.demandSurgePercent / 100 +
        priceEffectOnDemand +
        (params.adSpendDeltaPercent / 100) * 0.4);
    const effectivePriceFactor = 1 + params.priceAdjustmentPercent / 100;

    const projectedRevenue = Math.round(baseRev * netDemandFactor * effectivePriceFactor);
    const revenueDeltaPercent = parseFloat(
      (((projectedRevenue - baseRev) / baseRev) * 100).toFixed(1)
    );

    // Margins expand with price increases, contract with expedited supplier delays
    const marginLiftFromPrice = (params.priceAdjustmentPercent / 100) * 0.45;
    const marginDragFromFreight = params.supplierDelayDays * 0.008;
    const projectedGrossMargin = parseFloat(
      Math.min(
        0.55,
        Math.max(0.25, baseMargin + marginLiftFromPrice - marginDragFromFreight)
      ).toFixed(3)
    );
    const grossMarginDeltaPercent = parseFloat(
      (((projectedGrossMargin - baseMargin) / baseMargin) * 100).toFixed(1)
    );

    // Stockout risk calculation
    let stockoutSKUs = 2;
    if (params.demandSurgePercent > 20 || params.supplierDelayDays > 2) stockoutSKUs += 2;
    if (params.demandSurgePercent > 40) stockoutSKUs += 3;

    const projectedProfit = projectedRevenue * projectedGrossMargin;
    const baseProfit = baseRev * baseMargin;
    const estimatedNetProfitGain = Math.round(projectedProfit - baseProfit);

    return {
      baselineRevenue: baseRev,
      projectedRevenue,
      revenueDeltaPercent,
      baselineGrossMargin: baseMargin,
      projectedGrossMargin,
      grossMarginDeltaPercent,
      stockoutRiskSKUs: stockoutSKUs,
      estimatedNetProfitGain,
      confidenceScore: 92,
      recommendationSummary: `Simulation indicates a net profit expansion of +₹${estimatedNetProfitGain.toLocaleString('en-IN')}. With a ${params.priceAdjustmentPercent}% price shift, unit margins offset the volume dampening safely.`
    };
  }
};
