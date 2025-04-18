import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Order, OrderDocument } from '../mongo/order.schema';
import { ProductService } from '@/modules/products/products.service';
import { CompanyService } from '@/modules/company/company.service';

@Injectable()
export class OrderDataService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,
    private readonly companyService: CompanyService,
  ) {}

  // 1. Summary cards
  async getOrderSummary(companyId: number) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayCount, monthlyOrders, completedCount, monthlyRevenue] = await Promise.all([
      this.orderModel.countDocuments({
        createdAt: { $gte: startOfToday },
        sellerCompanyId: companyId
      }),
      this.orderModel.countDocuments({
        createdAt: { $gte: startOfMonth },
        sellerCompanyId: companyId
      }),
      this.orderModel.countDocuments({
        createdAt: { $gte: startOfMonth },
        status: 'completed',
        sellerCompanyId: companyId
      }),
      this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: 'completed',
            sellerCompanyId: companyId
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ] as PipelineStage[])
    ]);

    const revenue = monthlyRevenue[0]?.totalRevenue || 0;

    return {
      todayOrderCount: todayCount,
      monthlyOrderCount: monthlyOrders,
      completedRate: monthlyOrders > 0 ? (completedCount / monthlyOrders * 100).toFixed(1) + '%' : '0%',
      monthlyRevenue: revenue
    };
  }

  // 2. Pie chart - Order status distribution
  async getStatusSummary(companyId: number) {
    const result = await this.orderModel.aggregate([
      { $match: { sellerCompanyId: companyId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ] as PipelineStage[]);
    return {
      statusCounts: result.map(r => ({
        status: r._id,
        count: r.count
      }))
    };
  }

  // 3. Line chart - Order trend
  async getOrderTrend(companyId: number) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const trend = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: fromDate }, sellerCompanyId: companyId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ] as PipelineStage[]);

    return {
      trend: trend.map(t => ({ date: t._id, count: t.count }))
    };
  }

  // 4. Line chart - Revenue trend
  async getRevenueTrend(companyId: number) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const revenue = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          status: 'completed',
          sellerCompanyId: companyId
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ] as PipelineStage[]);

    return {
      revenue: revenue.map(r => ({ date: r._id, total: r.total }))
    };
  }

  // 5. Bar chart - Top products
  async getTopProducts(companyId: number): Promise<{ productId: number; name: string; quantity: number }[]> {
    const pipeline: PipelineStage[] = [
      { $match: { sellerCompanyId: companyId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          quantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 6 }
    ];
  
    const result = await this.orderModel.aggregate(pipeline); // [{ _id: 101, quantity: 88 }, ...]
  
    const productIds = result.map(r => r._id);
    const products = await this.productService.findByIds(productIds); // MySQL 查询
    const productMap = new Map(products.map(p => [p.id, p.name]));
  
    return result.map(r => ({
      productId: r._id,
      name: productMap.get(r._id) || `#${r._id}`,
      quantity: r.quantity
    }));
  }
  

  // 6. Bar chart - Top buyers
  async getTopBuyers(companyId: number): Promise<{ companyId: number; name: string; count: number }[]> {
    const pipeline: PipelineStage[] = [
      { $match: { sellerCompanyId: companyId } },
      {
        $group: {
          _id: '$buyerCompanyId', // 用 ID 分组更规范
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ];
  
    const result = await this.orderModel.aggregate(pipeline); // result: [{ _id: 3, count: 21 }, ...]
  
    const companyIds = result.map(r => r._id);
    const companies = await this.companyService.findByIds(companyIds); // 用 ID 查公司
    const companyMap = new Map(companies.map(c => [c.id, c.name]));
  
    return result.map(r => ({
      companyId: r._id,
      name: companyMap.get(r._id) || `#${r._id}`,
      count: r.count
    }));
  }
  
}
