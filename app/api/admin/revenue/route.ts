// app/api/revenue/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Replace with your actual database query
    const data = {
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      averageOrderValue: 250,
      successRate: 98,
      revenueHistory: [
        { date: '2024-01', amount: 12000 },
        { date: '2024-02', amount: 14000 },
        { date: '2024-03', amount: 15000 },
        // Add more historical data
      ]
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}