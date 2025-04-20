import { OrderDataService } from '../orderdata/orderdata.service';
import { InventoryDataService } from '../inventorydata/inventorydata.service';
import { PredictionService } from '../prediction/prediction.service';

export async function buildCompanyReportData(
  companyId: number,
  orderDataService: OrderDataService,
  inventoryDataService: InventoryDataService,
  predictionService: PredictionService
): Promise<any> {
  const orderSummary = await orderDataService.getOrderSummary(companyId);
  const topProducts = await orderDataService.getTopProducts(companyId);
  const topBuyers = await orderDataService.getTopBuyers(companyId);

  const inventorySummary = await inventoryDataService.getInventorySummary(companyId);
  const lowStockItems = await inventoryDataService.getWarningProducts(companyId);
  const inventoryTrend = await inventoryDataService.getFlowTrend(companyId);

  const salesForecast = await predictionService.predictRevenueTrend(companyId);
  const stockForecast = await predictionService.predictStockTrend(companyId);

  return {
    orderSummary: {
      ...orderSummary,
      topProducts,
      topBuyers
    },
    inventorySummary: {
      ...inventorySummary,
      lowStockItems,
      inventoryTrend
    },
    forecast: {
      salesForecast,
      stockForecast
    }
  };
}
