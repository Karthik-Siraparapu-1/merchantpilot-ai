/**
 * Business Digital Twin & Scenario Simulator
 * Simulates microeconomic and operational impacts across revenue, profit,
 * customer churn, and inventory runway based on merchant levers.
 */

export interface ScenarioInput {
  priceAdjustmentPercent: number; // e.g. +8%
  marketingSpendMultiplier: number; // e.g. 1.5x
  supplierDelayDays: number; // e.g. 5 days
  inventoryBufferPercent: number; // e.g. +20%
}

export interface ScenarioOutput {
  projectedMonthlyRevenueMinor: number;
  revenueDeltaPercent: number;
  projectedMonthlyProfitMinor: number;
  profitDeltaPercent: number;
  projectedOrderVolume: number;
  orderVolumeDeltaPercent: number;
  churnRiskIndex: number; // 0 - 100
  supplierStrainIndex: number; // 0 - 100
  stockoutRiskPercent: number;
  confidenceScore: number;
  trajectoryPoints: Array<{
    period: string;
    baselineRevenueMinor: number;
    simulatedRevenueMinor: number;
    simulatedProfitMinor: number;
  }>;
}

export const scenarioSimulator = {
  simulate(
    baseline: {
      monthlyRevenueMinor: number;
      monthlyOrders: number;
      grossMarginPercent: number;
    },
    input: ScenarioInput
  ): ScenarioOutput {
    const baseRev = Math.max(15000000, baseline.monthlyRevenueMinor || 35000000);
    const baseOrders = Math.max(120, baseline.monthlyOrders || 450);
    const baseMargin = baseline.grossMarginPercent || 35;

    // Elasticity model: -0.35 elasticity (for every +1% price, demand drops 0.35%)
    const demandChangePercent = -0.35 * input.priceAdjustmentPercent;
    // Marketing multiplier effect: 1x baseline, every +0.5x adds +12% order volume
    const marketingVolumeBoost = (input.marketingSpendMultiplier - 1.0) * 24;

    const netOrderVolumeChangePercent = demandChangePercent + marketingVolumeBoost;
    const projectedOrders = Math.round(baseOrders * (1 + netOrderVolumeChangePercent / 100));

    // Revenue = Price * Volume
    const priceMultiplier = 1 + input.priceAdjustmentPercent / 100;
    const volumeMultiplier = 1 + netOrderVolumeChangePercent / 100;
    const projectedRev = Math.round(baseRev * priceMultiplier * volumeMultiplier);
    const revDelta = Math.round(((projectedRev - baseRev) / baseRev) * 1000) / 10;

    // Profit = Revenue * (Margin + price delta impact - marketing costs)
    const newMarginPercent =
      baseMargin + input.priceAdjustmentPercent * 0.7 - (input.marketingSpendMultiplier - 1) * 3;
    const projectedProfit = Math.round(projectedRev * (newMarginPercent / 100));
    const baselineProfit = Math.round(baseRev * (baseMargin / 100));
    const profitDelta =
      Math.round(((projectedProfit - baselineProfit) / baselineProfit) * 1000) / 10;

    // Churn & Supplier Risk indices
    const churnRisk = Math.min(
      100,
      Math.max(5, Math.round(12 + Math.max(0, input.priceAdjustmentPercent) * 1.8))
    );
    const supplierStrain = Math.min(
      100,
      Math.max(10, Math.round(20 + input.supplierDelayDays * 5.5))
    );
    const stockoutRisk = Math.min(
      95,
      Math.max(
        2,
        Math.round(8 + input.supplierDelayDays * 4.2 - input.inventoryBufferPercent * 0.3)
      )
    );

    // Generate 6-month projected trajectory points
    const trajectoryPoints = [
      {
        period: 'Month 1',
        baselineRevenueMinor: baseRev,
        simulatedRevenueMinor: Math.round(projectedRev * 0.94),
        simulatedProfitMinor: Math.round(projectedProfit * 0.94)
      },
      {
        period: 'Month 2',
        baselineRevenueMinor: Math.round(baseRev * 1.05),
        simulatedRevenueMinor: Math.round(projectedRev * 1.02),
        simulatedProfitMinor: Math.round(projectedProfit * 1.02)
      },
      {
        period: 'Month 3',
        baselineRevenueMinor: Math.round(baseRev * 1.1),
        simulatedRevenueMinor: Math.round(projectedRev * 1.09),
        simulatedProfitMinor: Math.round(projectedProfit * 1.1)
      },
      {
        period: 'Month 4',
        baselineRevenueMinor: Math.round(baseRev * 1.15),
        simulatedRevenueMinor: Math.round(projectedRev * 1.18),
        simulatedProfitMinor: Math.round(projectedProfit * 1.2)
      },
      {
        period: 'Month 5',
        baselineRevenueMinor: Math.round(baseRev * 1.2),
        simulatedRevenueMinor: Math.round(projectedRev * 1.26),
        simulatedProfitMinor: Math.round(projectedProfit * 1.28)
      },
      {
        period: 'Month 6',
        baselineRevenueMinor: Math.round(baseRev * 1.25),
        simulatedRevenueMinor: Math.round(projectedRev * 1.35),
        simulatedProfitMinor: Math.round(projectedProfit * 1.38)
      }
    ];

    return {
      projectedMonthlyRevenueMinor: projectedRev,
      revenueDeltaPercent: revDelta,
      projectedMonthlyProfitMinor: projectedProfit,
      profitDeltaPercent: profitDelta,
      projectedOrderVolume: projectedOrders,
      orderVolumeDeltaPercent: Math.round(netOrderVolumeChangePercent * 10) / 10,
      churnRiskIndex: churnRisk,
      supplierStrainIndex: supplierStrain,
      stockoutRiskPercent: stockoutRisk,
      confidenceScore: 0.94,
      trajectoryPoints
    };
  }
};
