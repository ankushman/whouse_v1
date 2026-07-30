import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1']

const CATEGORIES = ['Electronics', 'Apparel', 'FMCG', 'Home & Garden', 'Pharma', 'Automotive', 'Sports', 'Beauty']
const REGIONS = ['North India', 'South India', 'West India', 'East India', 'Central India', 'NE India', 'Metro Tier1', 'Rural']
const MODELS = ['ARIMA', 'Prophet', 'LSTM', 'XGBoost', 'Ensemble', 'Transformer']
const ACCURACIES = ['High (>95%)', 'Medium (85-95%)', 'Low (<85%)']
const STATUSES = ['Active', 'Draft', 'Paused', 'Archived']
const SIGNALS = ['Bullish', 'Bearish', 'Neutral', 'Seasonal Spike', 'Trend Break']
const HORIZONS = ['7d', '14d', '30d', '60d', '90d']

const forecasts = [
  { id: 'DS-0001', sku: 'SKU-32917', category: 'Electronics', region: 'North India', model: 'ARIMA', horizon: '7d', predicted: 575, actual: 586, mape: 1.9, bias: -4.8, accuracy: 'High (>95%)', status: 'Active', confidence: 83, signal: 'Bullish', updatedAt: '2026-07-17' },
  { id: 'DS-0002', sku: 'SKU-20214', category: 'Apparel', region: 'South India', model: 'Prophet', horizon: '14d', predicted: 646, actual: 688, mape: 6.1, bias: 10.0, accuracy: 'Medium (85-95%)', status: 'Draft', confidence: 86, signal: 'Bearish', updatedAt: '2026-07-04' },
  { id: 'DS-0003', sku: 'SKU-24662', category: 'FMCG', region: 'West India', model: 'LSTM', horizon: '30d', predicted: 918, actual: 945, mape: 2.9, bias: 4.1, accuracy: 'Low (<85%)', status: 'Paused', confidence: 82, signal: 'Neutral', updatedAt: '2026-07-25' },
  { id: 'DS-0004', sku: 'SKU-28716', category: 'Home & Garden', region: 'East India', model: 'XGBoost', horizon: '60d', predicted: 523, actual: 465, mape: 12.5, bias: -5.4, accuracy: 'High (>95%)', status: 'Archived', confidence: 99, signal: 'Seasonal Spike', updatedAt: '2026-07-24' },
  { id: 'DS-0005', sku: 'SKU-72487', category: 'Pharma', region: 'Central India', model: 'Ensemble', horizon: '90d', predicted: 562, actual: 497, mape: 13.1, bias: 10.0, accuracy: 'Medium (85-95%)', status: 'Active', confidence: 77, signal: 'Trend Break', updatedAt: '2026-07-30' },
  { id: 'DS-0006', sku: 'SKU-22009', category: 'Automotive', region: 'NE India', model: 'Transformer', horizon: '7d', predicted: 122, actual: 79, mape: 54.4, bias: -3.2, accuracy: 'Low (<85%)', status: 'Draft', confidence: 69, signal: 'Bullish', updatedAt: '2026-07-05' },
  { id: 'DS-0007', sku: 'SKU-81222', category: 'Sports', region: 'Metro Tier1', model: 'ARIMA', horizon: '14d', predicted: 919, actual: 957, mape: 4.0, bias: -8.6, accuracy: 'High (>95%)', status: 'Paused', confidence: 72, signal: 'Bearish', updatedAt: '2026-07-09' },
  { id: 'DS-0008', sku: 'SKU-23059', category: 'Beauty', region: 'Rural', model: 'Prophet', horizon: '30d', predicted: 865, actual: 852, mape: 1.5, bias: 4.3, accuracy: 'Medium (85-95%)', status: 'Archived', confidence: 60, signal: 'Neutral', updatedAt: '2026-07-28' },
  { id: 'DS-0009', sku: 'SKU-45919', category: 'Electronics', region: 'North India', model: 'LSTM', horizon: '60d', predicted: 675, actual: 647, mape: 4.3, bias: 1.1, accuracy: 'Low (<85%)', status: 'Active', confidence: 68, signal: 'Seasonal Spike', updatedAt: '2026-07-14' },
  { id: 'DS-0010', sku: 'SKU-97145', category: 'Apparel', region: 'South India', model: 'XGBoost', horizon: '90d', predicted: 384, actual: 323, mape: 18.9, bias: -11.7, accuracy: 'High (>95%)', status: 'Draft', confidence: 69, signal: 'Trend Break', updatedAt: '2026-07-23' },
  { id: 'DS-0011', sku: 'SKU-72366', category: 'FMCG', region: 'West India', model: 'Ensemble', horizon: '7d', predicted: 339, actual: 380, mape: 10.8, bias: -7.8, accuracy: 'Medium (85-95%)', status: 'Paused', confidence: 85, signal: 'Bullish', updatedAt: '2026-07-05' },
  { id: 'DS-0012', sku: 'SKU-18466', category: 'Home & Garden', region: 'East India', model: 'Transformer', horizon: '14d', predicted: 707, actual: 663, mape: 6.6, bias: -3.4, accuracy: 'Low (<85%)', status: 'Archived', confidence: 96, signal: 'Bearish', updatedAt: '2026-07-17' },
  { id: 'DS-0013', sku: 'SKU-48353', category: 'Pharma', region: 'Central India', model: 'ARIMA', horizon: '30d', predicted: 441, actual: 465, mape: 5.2, bias: 12.6, accuracy: 'High (>95%)', status: 'Active', confidence: 64, signal: 'Neutral', updatedAt: '2026-07-12' },
  { id: 'DS-0014', sku: 'SKU-80219', category: 'Automotive', region: 'NE India', model: 'Prophet', horizon: '60d', predicted: 619, actual: 594, mape: 4.2, bias: 13.3, accuracy: 'Medium (85-95%)', status: 'Draft', confidence: 98, signal: 'Seasonal Spike', updatedAt: '2026-07-14' },
  { id: 'DS-0015', sku: 'SKU-87419', category: 'Sports', region: 'Metro Tier1', model: 'LSTM', horizon: '90d', predicted: 509, actual: 452, mape: 12.6, bias: 6.8, accuracy: 'Low (<85%)', status: 'Paused', confidence: 64, signal: 'Trend Break', updatedAt: '2026-07-21' },
  { id: 'DS-0016', sku: 'SKU-78770', category: 'Beauty', region: 'Rural', model: 'XGBoost', horizon: '7d', predicted: 338, actual: 271, mape: 24.7, bias: -9.7, accuracy: 'High (>95%)', status: 'Archived', confidence: 95, signal: 'Bullish', updatedAt: '2026-07-02' },
  { id: 'DS-0017', sku: 'SKU-86270', category: 'Electronics', region: 'North India', model: 'Ensemble', horizon: '14d', predicted: 633, actual: 590, mape: 7.3, bias: -10.7, accuracy: 'Medium (85-95%)', status: 'Active', confidence: 81, signal: 'Bearish', updatedAt: '2026-07-10' },
  { id: 'DS-0018', sku: 'SKU-65504', category: 'Apparel', region: 'South India', model: 'Transformer', horizon: '30d', predicted: 431, actual: 392, mape: 9.9, bias: -3.3, accuracy: 'Low (<85%)', status: 'Draft', confidence: 90, signal: 'Neutral', updatedAt: '2026-07-14' },
  { id: 'DS-0019', sku: 'SKU-33704', category: 'FMCG', region: 'West India', model: 'ARIMA', horizon: '60d', predicted: 630, actual: 645, mape: 2.3, bias: 0.1, accuracy: 'High (>95%)', status: 'Paused', confidence: 71, signal: 'Seasonal Spike', updatedAt: '2026-07-12' },
  { id: 'DS-0020', sku: 'SKU-96880', category: 'Home & Garden', region: 'East India', model: 'Prophet', horizon: '90d', predicted: 345, actual: 349, mape: 1.1, bias: -4.3, accuracy: 'Medium (85-95%)', status: 'Archived', confidence: 64, signal: 'Trend Break', updatedAt: '2026-07-11' },
  { id: 'DS-0021', sku: 'SKU-32603', category: 'Pharma', region: 'Central India', model: 'LSTM', horizon: '7d', predicted: 939, actual: 980, mape: 4.2, bias: -12.7, accuracy: 'Low (<85%)', status: 'Active', confidence: 90, signal: 'Bullish', updatedAt: '2026-07-19' },
  { id: 'DS-0022', sku: 'SKU-34221', category: 'Automotive', region: 'NE India', model: 'XGBoost', horizon: '14d', predicted: 740, actual: 719, mape: 2.9, bias: -13.5, accuracy: 'High (>95%)', status: 'Draft', confidence: 96, signal: 'Bearish', updatedAt: '2026-07-21' },
  { id: 'DS-0023', sku: 'SKU-95351', category: 'Sports', region: 'Metro Tier1', model: 'Ensemble', horizon: '30d', predicted: 284, actual: 315, mape: 9.8, bias: 0.3, accuracy: 'Medium (85-95%)', status: 'Paused', confidence: 67, signal: 'Neutral', updatedAt: '2026-07-02' },
  { id: 'DS-0024', sku: 'SKU-12568', category: 'Beauty', region: 'Rural', model: 'Transformer', horizon: '60d', predicted: 595, actual: 568, mape: 4.8, bias: -12.7, accuracy: 'Low (<85%)', status: 'Archived', confidence: 79, signal: 'Seasonal Spike', updatedAt: '2026-07-24' },
  { id: 'DS-0025', sku: 'SKU-48853', category: 'Electronics', region: 'North India', model: 'ARIMA', horizon: '90d', predicted: 644, actual: 631, mape: 2.1, bias: -2.0, accuracy: 'High (>95%)', status: 'Active', confidence: 95, signal: 'Trend Break', updatedAt: '2026-07-19' },
  { id: 'DS-0026', sku: 'SKU-18926', category: 'Apparel', region: 'South India', model: 'Prophet', horizon: '7d', predicted: 734, actual: 731, mape: 0.4, bias: -14.0, accuracy: 'Medium (85-95%)', status: 'Draft', confidence: 93, signal: 'Bullish', updatedAt: '2026-07-11' },
  { id: 'DS-0027', sku: 'SKU-66098', category: 'FMCG', region: 'West India', model: 'LSTM', horizon: '14d', predicted: 141, actual: 110, mape: 28.2, bias: -10.5, accuracy: 'Low (<85%)', status: 'Paused', confidence: 96, signal: 'Bearish', updatedAt: '2026-07-10' },
  { id: 'DS-0028', sku: 'SKU-17253', category: 'Home & Garden', region: 'East India', model: 'XGBoost', horizon: '30d', predicted: 746, actual: 678, mape: 10.0, bias: 3.4, accuracy: 'High (>95%)', status: 'Archived', confidence: 69, signal: 'Neutral', updatedAt: '2026-07-23' },
  { id: 'DS-0029', sku: 'SKU-11888', category: 'Pharma', region: 'Central India', model: 'Ensemble', horizon: '60d', predicted: 715, actual: 766, mape: 6.7, bias: 14.0, accuracy: 'Medium (85-95%)', status: 'Active', confidence: 92, signal: 'Seasonal Spike', updatedAt: '2026-07-07' },
  { id: 'DS-0030', sku: 'SKU-21315', category: 'Automotive', region: 'NE India', model: 'Transformer', horizon: '90d', predicted: 201, actual: 227, mape: 11.5, bias: -4.7, accuracy: 'Low (<85%)', status: 'Draft', confidence: 92, signal: 'Trend Break', updatedAt: '2026-07-20' },
  { id: 'DS-0031', sku: 'SKU-86694', category: 'Sports', region: 'Metro Tier1', model: 'ARIMA', horizon: '7d', predicted: 489, actual: 525, mape: 6.9, bias: -5.6, accuracy: 'High (>95%)', status: 'Paused', confidence: 90, signal: 'Bullish', updatedAt: '2026-07-02' },
  { id: 'DS-0032', sku: 'SKU-82546', category: 'Beauty', region: 'Rural', model: 'Prophet', horizon: '14d', predicted: 503, actual: 463, mape: 8.6, bias: -11.2, accuracy: 'Medium (85-95%)', status: 'Archived', confidence: 69, signal: 'Bearish', updatedAt: '2026-07-23' },
  { id: 'DS-0033', sku: 'SKU-85120', category: 'Electronics', region: 'North India', model: 'LSTM', horizon: '30d', predicted: 711, actual: 769, mape: 7.5, bias: -1.7, accuracy: 'Low (<85%)', status: 'Active', confidence: 97, signal: 'Neutral', updatedAt: '2026-07-06' },
  { id: 'DS-0034', sku: 'SKU-75956', category: 'Apparel', region: 'South India', model: 'XGBoost', horizon: '60d', predicted: 537, actual: 563, mape: 4.6, bias: -0.6, accuracy: 'High (>95%)', status: 'Draft', confidence: 70, signal: 'Seasonal Spike', updatedAt: '2026-07-02' },
  { id: 'DS-0035', sku: 'SKU-66342', category: 'FMCG', region: 'West India', model: 'Ensemble', horizon: '90d', predicted: 721, actual: 700, mape: 3.0, bias: -11.1, accuracy: 'Medium (85-95%)', status: 'Paused', confidence: 79, signal: 'Trend Break', updatedAt: '2026-07-19' },
  { id: 'DS-0036', sku: 'SKU-17504', category: 'Home & Garden', region: 'East India', model: 'Transformer', horizon: '7d', predicted: 640, actual: 569, mape: 12.5, bias: -14.7, accuracy: 'Low (<85%)', status: 'Archived', confidence: 91, signal: 'Bullish', updatedAt: '2026-07-14' },
  { id: 'DS-0037', sku: 'SKU-19895', category: 'Pharma', region: 'Central India', model: 'ARIMA', horizon: '14d', predicted: 550, actual: 566, mape: 2.8, bias: -6.2, accuracy: 'High (>95%)', status: 'Active', confidence: 89, signal: 'Bearish', updatedAt: '2026-07-26' },
  { id: 'DS-0038', sku: 'SKU-86460', category: 'Automotive', region: 'NE India', model: 'Prophet', horizon: '30d', predicted: 814, actual: 806, mape: 1.0, bias: 8.4, accuracy: 'Medium (85-95%)', status: 'Draft', confidence: 79, signal: 'Neutral', updatedAt: '2026-07-16' },
  { id: 'DS-0039', sku: 'SKU-23508', category: 'Sports', region: 'Metro Tier1', model: 'LSTM', horizon: '60d', predicted: 494, actual: 461, mape: 7.2, bias: -14.3, accuracy: 'Low (<85%)', status: 'Paused', confidence: 93, signal: 'Seasonal Spike', updatedAt: '2026-07-28' },
  { id: 'DS-0040', sku: 'SKU-83325', category: 'Beauty', region: 'Rural', model: 'XGBoost', horizon: '90d', predicted: 315, actual: 267, mape: 18.0, bias: -4.2, accuracy: 'High (>95%)', status: 'Archived', confidence: 85, signal: 'Trend Break', updatedAt: '2026-07-04' },
  { id: 'DS-0041', sku: 'SKU-35774', category: 'Electronics', region: 'North India', model: 'Ensemble', horizon: '7d', predicted: 759, actual: 702, mape: 8.1, bias: -9.4, accuracy: 'Medium (85-95%)', status: 'Active', confidence: 60, signal: 'Bullish', updatedAt: '2026-07-16' },
  { id: 'DS-0042', sku: 'SKU-88906', category: 'Apparel', region: 'South India', model: 'Transformer', horizon: '14d', predicted: 925, actual: 857, mape: 7.9, bias: -6.3, accuracy: 'Low (<85%)', status: 'Draft', confidence: 93, signal: 'Bearish', updatedAt: '2026-07-03' },
  { id: 'DS-0043', sku: 'SKU-85834', category: 'FMCG', region: 'West India', model: 'ARIMA', horizon: '30d', predicted: 301, actual: 270, mape: 11.5, bias: 3.3, accuracy: 'High (>95%)', status: 'Paused', confidence: 92, signal: 'Neutral', updatedAt: '2026-07-28' },
  { id: 'DS-0044', sku: 'SKU-57726', category: 'Home & Garden', region: 'East India', model: 'Prophet', horizon: '60d', predicted: 846, actual: 784, mape: 7.9, bias: -12.0, accuracy: 'Medium (85-95%)', status: 'Archived', confidence: 62, signal: 'Seasonal Spike', updatedAt: '2026-07-26' },
  { id: 'DS-0045', sku: 'SKU-61221', category: 'Pharma', region: 'Central India', model: 'LSTM', horizon: '90d', predicted: 344, actual: 314, mape: 9.6, bias: -2.1, accuracy: 'Low (<85%)', status: 'Active', confidence: 74, signal: 'Trend Break', updatedAt: '2026-07-19' },
  { id: 'DS-0046', sku: 'SKU-51366', category: 'Automotive', region: 'NE India', model: 'XGBoost', horizon: '7d', predicted: 286, actual: 346, mape: 17.3, bias: 11.3, accuracy: 'High (>95%)', status: 'Draft', confidence: 89, signal: 'Bullish', updatedAt: '2026-07-04' },
  { id: 'DS-0047', sku: 'SKU-56568', category: 'Sports', region: 'Metro Tier1', model: 'Ensemble', horizon: '14d', predicted: 550, actual: 590, mape: 6.8, bias: -2.9, accuracy: 'Medium (85-95%)', status: 'Paused', confidence: 81, signal: 'Bearish', updatedAt: '2026-07-19' },
  { id: 'DS-0048', sku: 'SKU-22955', category: 'Beauty', region: 'Rural', model: 'Transformer', horizon: '30d', predicted: 702, actual: 729, mape: 3.7, bias: -12.8, accuracy: 'Low (<85%)', status: 'Archived', confidence: 94, signal: 'Neutral', updatedAt: '2026-07-08' },
  { id: 'DS-0049', sku: 'SKU-59516', category: 'Electronics', region: 'North India', model: 'ARIMA', horizon: '60d', predicted: 337, actual: 323, mape: 4.3, bias: 9.5, accuracy: 'High (>95%)', status: 'Active', confidence: 83, signal: 'Seasonal Spike', updatedAt: '2026-07-03' },
  { id: 'DS-0050', sku: 'SKU-25425', category: 'Apparel', region: 'South India', model: 'Prophet', horizon: '90d', predicted: 309, actual: 250, mape: 23.6, bias: 11.2, accuracy: 'Medium (85-95%)', status: 'Draft', confidence: 79, signal: 'Trend Break', updatedAt: '2026-07-23' },
  { id: 'DS-0051', sku: 'SKU-89887', category: 'FMCG', region: 'West India', model: 'LSTM', horizon: '7d', predicted: 762, actual: 761, mape: 0.1, bias: 13.6, accuracy: 'Low (<85%)', status: 'Paused', confidence: 95, signal: 'Bullish', updatedAt: '2026-07-19' },
  { id: 'DS-0052', sku: 'SKU-24881', category: 'Home & Garden', region: 'East India', model: 'XGBoost', horizon: '14d', predicted: 388, actual: 354, mape: 9.6, bias: 9.0, accuracy: 'High (>95%)', status: 'Archived', confidence: 62, signal: 'Bearish', updatedAt: '2026-07-25' },
  { id: 'DS-0053', sku: 'SKU-42298', category: 'Pharma', region: 'Central India', model: 'Ensemble', horizon: '30d', predicted: 634, actual: 621, mape: 2.1, bias: 7.2, accuracy: 'Medium (85-95%)', status: 'Active', confidence: 60, signal: 'Neutral', updatedAt: '2026-07-07' },
  { id: 'DS-0054', sku: 'SKU-41947', category: 'Automotive', region: 'NE India', model: 'Transformer', horizon: '60d', predicted: 447, actual: 472, mape: 5.3, bias: -12.1, accuracy: 'Low (<85%)', status: 'Draft', confidence: 77, signal: 'Seasonal Spike', updatedAt: '2026-07-11' },
  { id: 'DS-0055', sku: 'SKU-51215', category: 'Sports', region: 'Metro Tier1', model: 'ARIMA', horizon: '90d', predicted: 934, actual: 900, mape: 3.8, bias: 0.2, accuracy: 'High (>95%)', status: 'Paused', confidence: 98, signal: 'Trend Break', updatedAt: '2026-07-11' },
  { id: 'DS-0056', sku: 'SKU-28970', category: 'Beauty', region: 'Rural', model: 'Prophet', horizon: '7d', predicted: 112, actual: 170, mape: 34.1, bias: 2.5, accuracy: 'Medium (85-95%)', status: 'Archived', confidence: 72, signal: 'Bullish', updatedAt: '2026-07-29' },
  { id: 'DS-0057', sku: 'SKU-10821', category: 'Electronics', region: 'North India', model: 'LSTM', horizon: '14d', predicted: 299, actual: 346, mape: 13.6, bias: -2.7, accuracy: 'Low (<85%)', status: 'Active', confidence: 69, signal: 'Bearish', updatedAt: '2026-07-08' },
  { id: 'DS-0058', sku: 'SKU-24173', category: 'Apparel', region: 'South India', model: 'XGBoost', horizon: '30d', predicted: 565, actual: 510, mape: 10.8, bias: -14.1, accuracy: 'High (>95%)', status: 'Draft', confidence: 76, signal: 'Neutral', updatedAt: '2026-07-06' },
  { id: 'DS-0059', sku: 'SKU-11837', category: 'FMCG', region: 'West India', model: 'Ensemble', horizon: '60d', predicted: 193, actual: 243, mape: 20.6, bias: 0.0, accuracy: 'Medium (85-95%)', status: 'Paused', confidence: 85, signal: 'Seasonal Spike', updatedAt: '2026-07-15' },
  { id: 'DS-0060', sku: 'SKU-96991', category: 'Home & Garden', region: 'East India', model: 'Transformer', horizon: '90d', predicted: 204, actual: 230, mape: 11.3, bias: 10.6, accuracy: 'Low (<85%)', status: 'Archived', confidence: 92, signal: 'Trend Break', updatedAt: '2026-07-08' },
]

const monthlyData = [
  { month: 'Jan', forecast: 409, actual: 808, accuracy: 86.4 },
  { month: 'Feb', forecast: 586, actual: 410, accuracy: 88.8 },
  { month: 'Mar', forecast: 753, actual: 653, accuracy: 95.3 },
  { month: 'Apr', forecast: 429, actual: 813, accuracy: 90.7 },
  { month: 'May', forecast: 539, actual: 499, accuracy: 86.5 },
  { month: 'Jun', forecast: 660, actual: 818, accuracy: 86.9 },
  { month: 'Jul', forecast: 665, actual: 799, accuracy: 93.2 },
  { month: 'Aug', forecast: 516, actual: 481, accuracy: 83.9 },
  { month: 'Sep', forecast: 798, actual: 646, accuracy: 83.5 },
  { month: 'Oct', forecast: 698, actual: 583, accuracy: 97.9 },
  { month: 'Nov', forecast: 582, actual: 789, accuracy: 97.0 },
  { month: 'Dec', forecast: 416, actual: 744, accuracy: 82.2 },
]

const categoryDist = [
  { name: 'Electronics', value: 80 },
  { name: 'Apparel', value: 163 },
  { name: 'FMCG', value: 170 },
  { name: 'Home & Garden', value: 147 },
  { name: 'Pharma', value: 126 },
  { name: 'Automotive', value: 71 },
  { name: 'Sports', value: 165 },
  { name: 'Beauty', value: 136 },
]

const filterGroups = [
  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'model', label: 'Model', options: MODELS.map(m => ({ value: m, label: m, count: 0 })) },
  { key: 'accuracy', label: 'Accuracy', options: ACCURACIES.map(a => ({ value: a, label: a, count: 0 })) },
]

function AccuracyBadge({ accuracy }: { accuracy: string }) {
  const color = accuracy.startsWith('High') ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : accuracy.startsWith('Medium') ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'
  return <span className={'ads-acc-badge px-2 py-0.5 rounded-full text-xs font-medium border ' + color}>{accuracy}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Draft' ? 'bg-blue-500/15 text-blue-400' : status === 'Paused' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'ads-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function SignalBadge({ signal }: { signal: string }) {
  const color = signal === 'Bullish' ? 'bg-emerald-500/15 text-emerald-400' : signal === 'Bearish' ? 'bg-red-500/15 text-red-400' : signal === 'Seasonal Spike' ? 'bg-amber-500/15 text-amber-400' : signal === 'Trend Break' ? 'bg-violet-500/15 text-violet-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'ads-signal-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{signal}</span>
}

function MapeBar({ value }: { value: number }) {
  const w = Math.min(value * 2, 100)
  const color = value < 10 ? 'bg-emerald-500' : value < 20 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='ads-mape-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full ads-mape-fill ' + color} style={{ width: w + '%', animation: 'ads-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='ads-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='ads-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='ads-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='ads-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='ads-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 ads-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='ads-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Monsoon Demand Surge', desc: 'FMCG & Pharma categories show 23% spike in South India forecasts for Aug-Sep. LSTM model outperforms others with 96.2% accuracy.', severity: 'high' },
  { title: 'Model Drift Detected', desc: 'ARIMA model accuracy dropped below 85% for Electronics in Metro Tier1. Recommend switching to Ensemble model.', severity: 'medium' },
  { title: 'Festival Season Prep', desc: 'Diwali forecast signals +40% demand for Apparel and Home & Garden. Pre-position inventory in North & West India warehouses.', severity: 'high' },
  { title: 'Bias Correction Needed', desc: 'Central India region shows consistent +12% bias across all models. Recalibration suggested to prevent overstocking.', severity: 'low' },
]

export default function AiDemandSensingProView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => {
      const cur = prev[key] || []
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]
      return { ...prev, [key]: next }
    })
  }

  const filtered = forecasts.filter(f => {
    for (const [key, vals] of Object.entries(activeFilters)) {
      if (vals.length > 0 && !vals.includes(f[key as keyof typeof f] as string)) return false
    }
    if (searchQuery && !Object.values(f).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='ads-root space-y-4 p-4'>
      <PageHeader title='AI Demand Sensing Pro' description='ML-powered demand forecasting & sensing engine' />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='ads-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='ads-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='forecasts' className='ads-tab'>Forecasts</TabsTrigger>
          <TabsTrigger value='analytics' className='ads-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='ads-tab'>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='ads-tab-content space-y-4 mt-4'>
          <div className='ads-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Forecasts' value='2,847' sub='+12% vs last month' color='text-violet-400' />
            <KpiTile label='Avg Accuracy' value='91.3%' sub='+2.1pp improvement' color='text-blue-400' />
            <KpiTile label='Models Deployed' value='6' sub='All active in production' color='text-emerald-400' />
            <KpiTile label='Demand Signals' value='156' sub='38 bullish, 52 bearish' color='text-amber-400' />
          </div>
          <div className='ads-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={91} label='Accuracy' color='#8b5cf6' />
            <HealthRing value={87} label='Coverage' color='#3b82f6' />
            <HealthRing value={94} label='Timeliness' color='#10b981' />
            <HealthRing value={78} label='Confidence' color='#f59e0b' />
            <HealthRing value={89} label='Freshness' color='#06b6d4' />
            <HealthRing value={85} label='Stability' color='#ec4899' />
          </div>
          <div className='ads-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Forecast vs Actual</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='forecast' stroke='#8b5cf6' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='actual' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Model Accuracy Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='accuracy' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={categoryDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='forecasts' className='ads-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Demand Sensing' }, { label: 'Forecasts' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={forecasts.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search forecasts by ID, SKU, category..." />
          <Card className='ads-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='ads-table-wrap overflow-x-auto'><table className='ads-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>SKU</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Region</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Model</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Horizon</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Predicted</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Actual</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>MAPE</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Accuracy</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Signal</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>
          {filtered.map(f => (
            <tr key={f.id} className='ads-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-violet-400'>{f.id}</td>
              <td className='px-3 py-2 font-mono text-xs'>{f.sku}</td>
              <td className='px-3 py-2'><span className='ads-cat-badge px-1.5 py-0.5 rounded text-xs bg-violet-500/10 text-violet-300'>{f.category}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{f.region}</td>
              <td className='px-3 py-2 text-xs text-blue-300'>{f.model}</td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{f.horizon}</td>
              <td className='px-3 py-2 text-right text-xs font-medium'>{f.predicted}</td>
              <td className='px-3 py-2 text-right text-xs font-medium'>{f.actual}</td>
              <td className='px-3 py-2 w-24'><MapeBar value={f.mape} /><span className='text-[10px] text-zinc-500 ml-1'>{f.mape}%</span></td>
              <td className='px-3 py-2'><AccuracyBadge accuracy={f.accuracy} /></td>
              <td className='px-3 py-2'><SignalBadge signal={f.signal} /></td>
              <td className='px-3 py-2'><StatusBadge status={f.status} /></td>
            </tr>
          ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value='analytics' className='ads-tab-content space-y-4 mt-4'>
          <div className='ads-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Forecasts' value='2,847' change='+18% YoY' />
            <ValueTile label='Avg MAPE' value='8.7%' change='-1.2pp' />
            <ValueTile label='Best Model' value='LSTM' change='96.2% acc' />
            <ValueTile label='Signal Coverage' value='78%' change='+5% QoQ' />
          </div>
          <div className='ads-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Model Performance</CardTitle></CardHeader><CardContent><BarChart data={[  { name: 'ARIMA', accuracy: 91, mape: 18 },   { name: 'Prophet', accuracy: 87, mape: 12 },   { name: 'LSTM', accuracy: 84, mape: 7 },   { name: 'XGBoost', accuracy: 78, mape: 15 },   { name: 'Ensemble', accuracy: 96, mape: 10 },   { name: 'Transformer', accuracy: 83, mape: 18 }]} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='accuracy' fill='#8b5cf6' radius={[4,4,0,0]}/><Bar dataKey='mape' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Confidence Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'High (>90%)', value: 38 }, { name: 'Medium (70-90%)', value: 42 }, { name: 'Low (<70%)', value: 20 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#8b5cf6' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#f59e0b' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='insights' className='ads-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'ads-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-violet-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'ads-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-violet-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
