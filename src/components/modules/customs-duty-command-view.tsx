import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#eab308', '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#ec4899', '#10b981', '#ef4444']

const CATEGORIES = ['Electronics', 'Textiles', 'Auto Parts', 'Pharmaceuticals', 'Agricultural', 'Machinery', 'Chemical Products', 'Gemstones']
const PORTS = ['Nhava Sheva JNPT', 'Chennai Port', 'Kandla Port', 'Kolkata Haldia', 'Mundra Port', 'Cochin Port', 'Vizag Port', 'Tuticorin Port']
const DUTY_TYPES = ['Basic Customs', 'IGST', 'Social Welfare', 'Compensation Cess', 'Anti-Dumping', 'Safeguard Duty', 'Countervailing']
const STATUSES = ['Pending', 'Under Review', 'Assessed', 'Paid', 'Dispute']

const shipments = [
  { id: 'CDC-0001', category: 'Electronics', port: 'Nhava Sheva JNPT', duty_type: 'Basic Customs', status: 'Pending', duty_inr: 4200000, gst_inr: 1260000, clearance_hrs: 18.4, risk_score: 72, docs_complete: 'Yes', filing_date: '2026-07-15 09:22' },
  { id: 'CDC-0002', category: 'Textiles', port: 'Chennai Port', duty_type: 'IGST', status: 'Under Review', duty_inr: 890000, gst_inr: 267000, clearance_hrs: 32.1, risk_score: 35, docs_complete: 'Yes', filing_date: '2026-07-14 14:38' },
  { id: 'CDC-0003', category: 'Auto Parts', port: 'Kandla Port', duty_type: 'Social Welfare', status: 'Assessed', duty_inr: 5600000, gst_inr: 1680000, clearance_hrs: 8.7, risk_score: 15, docs_complete: 'Yes', filing_date: '2026-07-22 06:11' },
  { id: 'CDC-0004', category: 'Pharmaceuticals', port: 'Kolkata Haldia', duty_type: 'Compensation Cess', status: 'Paid', duty_inr: 320000, gst_inr: 96000, clearance_hrs: 45.2, risk_score: 88, docs_complete: 'Partial', filing_date: '2026-07-18 22:05' },
  { id: 'CDC-0005', category: 'Agricultural', port: 'Mundra Port', duty_type: 'Anti-Dumping', status: 'Dispute', duty_inr: 9800000, gst_inr: 2940000, clearance_hrs: 72.0, risk_score: 95, docs_complete: 'No', filing_date: '2026-07-08 03:47' },
  { id: 'CDC-0006', category: 'Machinery', port: 'Cochin Port', duty_type: 'Safeguard Duty', status: 'Pending', duty_inr: 2100000, gst_inr: 630000, clearance_hrs: 24.6, risk_score: 42, docs_complete: 'Yes', filing_date: '2026-07-25 17:33' },
  { id: 'CDC-0007', category: 'Chemical Products', port: 'Vizag Port', duty_type: 'Countervailing', status: 'Under Review', duty_inr: 780000, gst_inr: 234000, clearance_hrs: 15.3, risk_score: 28, docs_complete: 'Yes', filing_date: '2026-07-21 11:59' },
  { id: 'CDC-0008', category: 'Gemstones', port: 'Tuticorin Port', duty_type: 'Basic Customs', status: 'Paid', duty_inr: 6500000, gst_inr: 1950000, clearance_hrs: 12.8, risk_score: 55, docs_complete: 'Partial', filing_date: '2026-07-12 08:14' },
  { id: 'CDC-0009', category: 'Electronics', port: 'Mundra Port', duty_type: 'IGST', status: 'Assessed', duty_inr: 3100000, gst_inr: 930000, clearance_hrs: 6.2, risk_score: 18, docs_complete: 'Yes', filing_date: '2026-07-28 01:35' },
  { id: 'CDC-0010', category: 'Textiles', port: 'Kolkata Haldia', duty_type: 'Social Welfare', status: 'Paid', duty_inr: 450000, gst_inr: 135000, clearance_hrs: 38.5, risk_score: 62, docs_complete: 'Yes', filing_date: '2026-07-19 13:42' },
  { id: 'CDC-0011', category: 'Auto Parts', port: 'Nhava Sheva JNPT', duty_type: 'Anti-Dumping', status: 'Pending', duty_inr: 7200000, gst_inr: 2160000, clearance_hrs: 52.3, risk_score: 81, docs_complete: 'Partial', filing_date: '2026-07-10 20:18' },
  { id: 'CDC-0012', category: 'Pharmaceuticals', port: 'Chennai Port', duty_type: 'Basic Customs', status: 'Under Review', duty_inr: 1800000, gst_inr: 540000, clearance_hrs: 28.9, risk_score: 47, docs_complete: 'Yes', filing_date: '2026-07-26 15:51' },
  { id: 'CDC-0013', category: 'Agricultural', port: 'Kandla Port', duty_type: 'Compensation Cess', status: 'Assessed', duty_inr: 950000, gst_inr: 285000, clearance_hrs: 4.1, risk_score: 12, docs_complete: 'Yes', filing_date: '2026-07-23 07:06' },
  { id: 'CDC-0014', category: 'Machinery', port: 'Vizag Port', duty_type: 'Safeguard Duty', status: 'Dispute', duty_inr: 5400000, gst_inr: 1620000, clearance_hrs: 64.7, risk_score: 92, docs_complete: 'No', filing_date: '2026-07-05 18:24' },
  { id: 'CDC-0015', category: 'Chemical Products', port: 'Cochin Port', duty_type: 'IGST', status: 'Paid', duty_inr: 620000, gst_inr: 186000, clearance_hrs: 10.3, risk_score: 25, docs_complete: 'Yes', filing_date: '2026-07-27 04:19' },
  { id: 'CDC-0016', category: 'Gemstones', port: 'Mundra Port', duty_type: 'Countervailing', status: 'Assessed', duty_inr: 8900000, gst_inr: 2670000, clearance_hrs: 9.6, risk_score: 33, docs_complete: 'Yes', filing_date: '2026-07-24 16:55' },
  { id: 'CDC-0017', category: 'Electronics', port: 'Tuticorin Port', duty_type: 'Basic Customs', status: 'Pending', duty_inr: 2700000, gst_inr: 810000, clearance_hrs: 41.8, risk_score: 68, docs_complete: 'Partial', filing_date: '2026-07-11 23:07' },
  { id: 'CDC-0018', category: 'Textiles', port: 'Nhava Sheva JNPT', duty_type: 'Anti-Dumping', status: 'Under Review', duty_inr: 380000, gst_inr: 114000, clearance_hrs: 19.2, risk_score: 44, docs_complete: 'Yes', filing_date: '2026-07-20 10:28' },
  { id: 'CDC-0019', category: 'Auto Parts', port: 'Chennai Port', duty_type: 'Social Welfare', status: 'Paid', duty_inr: 8400000, gst_inr: 2520000, clearance_hrs: 7.5, risk_score: 21, docs_complete: 'Yes', filing_date: '2026-07-29 06:41' },
  { id: 'CDC-0020', category: 'Pharmaceuticals', port: 'Kolkata Haldia', duty_type: 'IGST', status: 'Assessed', duty_inr: 1600000, gst_inr: 480000, clearance_hrs: 22.4, risk_score: 38, docs_complete: 'Yes', filing_date: '2026-07-17 12:36' },
  { id: 'CDC-0021', category: 'Agricultural', port: 'Nhava Sheva JNPT', duty_type: 'Compensation Cess', status: 'Dispute', duty_inr: 2300000, gst_inr: 690000, clearance_hrs: 58.6, risk_score: 86, docs_complete: 'No', filing_date: '2026-07-04 09:15' },
  { id: 'CDC-0022', category: 'Machinery', port: 'Chennai Port', duty_type: 'Basic Customs', status: 'Pending', duty_inr: 4700000, gst_inr: 1410000, clearance_hrs: 35.2, risk_score: 59, docs_complete: 'Partial', filing_date: '2026-07-13 21:49' },
  { id: 'CDC-0023', category: 'Chemical Products', port: 'Kandla Port', duty_type: 'Safeguard Duty', status: 'Paid', duty_inr: 520000, gst_inr: 156000, clearance_hrs: 11.8, risk_score: 30, docs_complete: 'Yes', filing_date: '2026-07-25 14:22' },
  { id: 'CDC-0024', category: 'Gemstones', port: 'Mundra Port', duty_type: 'IGST', status: 'Under Review', duty_inr: 7600000, gst_inr: 2280000, clearance_hrs: 16.7, risk_score: 50, docs_complete: 'Yes', filing_date: '2026-07-22 19:03' },
  { id: 'CDC-0025', category: 'Electronics', port: 'Cochin Port', duty_type: 'Countervailing', status: 'Assessed', duty_inr: 3900000, gst_inr: 1170000, clearance_hrs: 5.9, risk_score: 14, docs_complete: 'Yes', filing_date: '2026-07-28 02:57' },
  { id: 'CDC-0026', category: 'Textiles', port: 'Vizag Port', duty_type: 'Anti-Dumping', status: 'Paid', duty_inr: 710000, gst_inr: 213000, clearance_hrs: 26.3, risk_score: 41, docs_complete: 'Yes', filing_date: '2026-07-16 08:44' },
  { id: 'CDC-0027', category: 'Auto Parts', port: 'Tuticorin Port', duty_type: 'Basic Customs', status: 'Pending', duty_inr: 6300000, gst_inr: 1890000, clearance_hrs: 48.1, risk_score: 77, docs_complete: 'Partial', filing_date: '2026-07-07 15:31' },
  { id: 'CDC-0028', category: 'Pharmaceuticals', port: 'Nhava Sheva JNPT', duty_type: 'Social Welfare', status: 'Dispute', duty_inr: 2900000, gst_inr: 870000, clearance_hrs: 66.4, risk_score: 90, docs_complete: 'No', filing_date: '2026-07-03 11:28' },
  { id: 'CDC-0029', category: 'Agricultural', port: 'Chennai Port', duty_type: 'Compensation Cess', status: 'Assessed', duty_inr: 840000, gst_inr: 252000, clearance_hrs: 13.6, risk_score: 22, docs_complete: 'Yes', filing_date: '2026-07-24 17:12' },
  { id: 'CDC-0030', category: 'Machinery', port: 'Kolkata Haldia', duty_type: 'IGST', status: 'Under Review', duty_inr: 5800000, gst_inr: 1740000, clearance_hrs: 29.5, risk_score: 53, docs_complete: 'Yes', filing_date: '2026-07-19 22:46' },
  { id: 'CDC-0031', category: 'Chemical Products', port: 'Nhava Sheva JNPT', duty_type: 'Basic Customs', status: 'Paid', duty_inr: 430000, gst_inr: 129000, clearance_hrs: 9.1, risk_score: 19, docs_complete: 'Yes', filing_date: '2026-07-27 05:33' },
  { id: 'CDC-0032', category: 'Gemstones', port: 'Chennai Port', duty_type: 'Safeguard Duty', status: 'Pending', duty_inr: 9200000, gst_inr: 2760000, clearance_hrs: 55.8, risk_score: 84, docs_complete: 'Partial', filing_date: '2026-07-06 20:09' },
  { id: 'CDC-0033', category: 'Electronics', port: 'Kandla Port', duty_type: 'Anti-Dumping', status: 'Assessed', duty_inr: 3500000, gst_inr: 1050000, clearance_hrs: 7.8, risk_score: 16, docs_complete: 'Yes', filing_date: '2026-07-26 13:17' },
  { id: 'CDC-0034', category: 'Textiles', port: 'Mundra Port', duty_type: 'Countervailing', status: 'Dispute', duty_inr: 560000, gst_inr: 168000, clearance_hrs: 61.2, risk_score: 87, docs_complete: 'No', filing_date: '2026-07-09 10:55' },
  { id: 'CDC-0035', category: 'Auto Parts', port: 'Cochin Port', duty_type: 'Social Welfare', status: 'Paid', duty_inr: 8100000, gst_inr: 2430000, clearance_hrs: 14.7, risk_score: 27, docs_complete: 'Yes', filing_date: '2026-07-23 18:41' },
  { id: 'CDC-0036', category: 'Pharmaceuticals', port: 'Vizag Port', duty_type: 'IGST', status: 'Under Review', duty_inr: 2200000, gst_inr: 660000, clearance_hrs: 33.6, risk_score: 48, docs_complete: 'Yes', filing_date: '2026-07-15 07:24' },
  { id: 'CDC-0037', category: 'Agricultural', port: 'Tuticorin Port', duty_type: 'Basic Customs', status: 'Assessed', duty_inr: 1800000, gst_inr: 540000, clearance_hrs: 6.4, risk_score: 11, docs_complete: 'Yes', filing_date: '2026-07-29 01:58' },
  { id: 'CDC-0038', category: 'Machinery', port: 'Nhava Sheva JNPT', duty_type: 'Compensation Cess', status: 'Pending', duty_inr: 4900000, gst_inr: 1470000, clearance_hrs: 43.7, risk_score: 71, docs_complete: 'Partial', filing_date: '2026-07-12 16:32' },
  { id: 'CDC-0039', category: 'Chemical Products', port: 'Chennai Port', duty_type: 'Anti-Dumping', status: 'Paid', duty_inr: 340000, gst_inr: 102000, clearance_hrs: 20.5, risk_score: 36, docs_complete: 'Yes', filing_date: '2026-07-21 11:06' },
  { id: 'CDC-0040', category: 'Gemstones', port: 'Kandla Port', duty_type: 'Safeguard Duty', status: 'Dispute', duty_inr: 7000000, gst_inr: 2100000, clearance_hrs: 69.3, risk_score: 93, docs_complete: 'No', filing_date: '2026-07-02 14:48' },
  { id: 'CDC-0041', category: 'Electronics', port: 'Kolkata Haldia', duty_type: 'IGST', status: 'Under Review', duty_inr: 2600000, gst_inr: 780000, clearance_hrs: 31.4, risk_score: 56, docs_complete: 'Yes', filing_date: '2026-07-18 09:19' },
  { id: 'CDC-0042', category: 'Textiles', port: 'Cochin Port', duty_type: 'Basic Customs', status: 'Assessed', duty_inr: 480000, gst_inr: 144000, clearance_hrs: 8.2, risk_score: 20, docs_complete: 'Yes', filing_date: '2026-07-25 04:27' },
  { id: 'CDC-0043', category: 'Auto Parts', port: 'Vizag Port', duty_type: 'Countervailing', status: 'Pending', duty_inr: 6700000, gst_inr: 2010000, clearance_hrs: 50.5, risk_score: 79, docs_complete: 'Partial', filing_date: '2026-07-10 22:51' },
  { id: 'CDC-0044', category: 'Pharmaceuticals', port: 'Mundra Port', duty_type: 'Social Welfare', status: 'Paid', duty_inr: 1500000, gst_inr: 450000, clearance_hrs: 17.9, risk_score: 32, docs_complete: 'Yes', filing_date: '2026-07-24 15:34' },
  { id: 'CDC-0045', category: 'Agricultural', port: 'Nhava Sheva JNPT', duty_type: 'Anti-Dumping', status: 'Under Review', duty_inr: 920000, gst_inr: 276000, clearance_hrs: 27.3, risk_score: 45, docs_complete: 'Yes', filing_date: '2026-07-20 08:12' },
  { id: 'CDC-0046', category: 'Machinery', port: 'Chennai Port', duty_type: 'IGST', status: 'Assessed', duty_inr: 5500000, gst_inr: 1650000, clearance_hrs: 10.6, risk_score: 24, docs_complete: 'Yes', filing_date: '2026-07-28 06:45' },
  { id: 'CDC-0047', category: 'Chemical Products', port: 'Kolkata Haldia', duty_type: 'Basic Customs', status: 'Dispute', duty_inr: 410000, gst_inr: 123000, clearance_hrs: 63.1, risk_score: 89, docs_complete: 'No', filing_date: '2026-07-01 19:33' },
  { id: 'CDC-0048', category: 'Gemstones', port: 'Nhava Sheva JNPT', duty_type: 'Compensation Cess', status: 'Paid', duty_inr: 8300000, gst_inr: 2490000, clearance_hrs: 11.4, risk_score: 37, docs_complete: 'Yes', filing_date: '2026-07-22 13:58' },
  { id: 'CDC-0049', category: 'Electronics', port: 'Cochin Port', duty_type: 'Safeguard Duty', status: 'Pending', duty_inr: 2000000, gst_inr: 600000, clearance_hrs: 39.6, risk_score: 65, docs_complete: 'Partial', filing_date: '2026-07-14 17:25' },
  { id: 'CDC-0050', category: 'Textiles', port: 'Vizag Port', duty_type: 'Anti-Dumping', status: 'Assessed', duty_inr: 640000, gst_inr: 192000, clearance_hrs: 13.1, risk_score: 23, docs_complete: 'Yes', filing_date: '2026-07-27 10:08' },
  { id: 'CDC-0051', category: 'Auto Parts', port: 'Tuticorin Port', duty_type: 'IGST', status: 'Under Review', duty_inr: 7300000, gst_inr: 2190000, clearance_hrs: 34.8, risk_score: 52, docs_complete: 'Yes', filing_date: '2026-07-16 21:41' },
  { id: 'CDC-0052', category: 'Pharmaceuticals', port: 'Kandla Port', duty_type: 'Basic Customs', status: 'Dispute', duty_inr: 3000000, gst_inr: 900000, clearance_hrs: 67.5, risk_score: 91, docs_complete: 'No', filing_date: '2026-07-03 06:14' },
  { id: 'CDC-0053', category: 'Agricultural', port: 'Mundra Port', duty_type: 'Social Welfare', status: 'Paid', duty_inr: 460000, gst_inr: 138000, clearance_hrs: 9.8, risk_score: 17, docs_complete: 'Yes', filing_date: '2026-07-26 12:39' },
  { id: 'CDC-0054', category: 'Machinery', port: 'Nhava Sheva JNPT', duty_type: 'Countervailing', status: 'Assessed', duty_inr: 5100000, gst_inr: 1530000, clearance_hrs: 15.6, risk_score: 29, docs_complete: 'Yes', filing_date: '2026-07-23 08:52' },
  { id: 'CDC-0055', category: 'Chemical Products', port: 'Chennai Port', duty_type: 'Compensation Cess', status: 'Pending', duty_inr: 750000, gst_inr: 225000, clearance_hrs: 44.2, risk_score: 73, docs_complete: 'Partial', filing_date: '2026-07-11 14:37' },
  { id: 'CDC-0056', category: 'Gemstones', port: 'Kolkata Haldia', duty_type: 'IGST', status: 'Under Review', duty_inr: 6800000, gst_inr: 2040000, clearance_hrs: 21.7, risk_score: 46, docs_complete: 'Yes', filing_date: '2026-07-19 16:24' },
  { id: 'CDC-0057', category: 'Electronics', port: 'Kandla Port', duty_type: 'Basic Customs', status: 'Paid', duty_inr: 3800000, gst_inr: 1140000, clearance_hrs: 12.3, risk_score: 26, docs_complete: 'Yes', filing_date: '2026-07-25 09:46' },
  { id: 'CDC-0058', category: 'Textiles', port: 'Mundra Port', duty_type: 'Safeguard Duty', status: 'Dispute', duty_inr: 530000, gst_inr: 159000, clearance_hrs: 57.9, risk_score: 82, docs_complete: 'No', filing_date: '2026-07-05 11:58' },
  { id: 'CDC-0059', category: 'Auto Parts', port: 'Chennai Port', duty_type: 'Anti-Dumping', status: 'Assessed', duty_inr: 9000000, gst_inr: 2700000, clearance_hrs: 5.3, risk_score: 10, docs_complete: 'Yes', filing_date: '2026-07-29 03:22' },
  { id: 'CDC-0060', category: 'Pharmaceuticals', port: 'Cochin Port', duty_type: 'IGST', status: 'Pending', duty_inr: 2400000, gst_inr: 720000, clearance_hrs: 36.4, risk_score: 63, docs_complete: 'Partial', filing_date: '2026-07-13 20:05' },
]

const hourlyData = [
  { hour: '00:00', filings: 42, clearances: 31, revenue_lakh: 8.2 },
  { hour: '01:00', filings: 18, clearances: 24, revenue_lakh: 4.1 },
  { hour: '02:00', filings: 56, clearances: 38, revenue_lakh: 12.7 },
  { hour: '03:00', filings: 33, clearances: 45, revenue_lakh: 7.5 },
  { hour: '04:00', filings: 71, clearances: 52, revenue_lakh: 15.3 },
  { hour: '05:00', filings: 25, clearances: 19, revenue_lakh: 5.8 },
  { hour: '06:00', filings: 84, clearances: 67, revenue_lakh: 16.9 },
  { hour: '07:00', filings: 62, clearances: 48, revenue_lakh: 13.1 },
  { hour: '08:00', filings: 38, clearances: 29, revenue_lakh: 9.4 },
  { hour: '09:00', filings: 77, clearances: 58, revenue_lakh: 17.2 },
  { hour: '10:00', filings: 53, clearances: 41, revenue_lakh: 11.8 },
  { hour: '11:00', filings: 85, clearances: 72, revenue_lakh: 18.6 },
  { hour: '12:00', filings: 44, clearances: 35, revenue_lakh: 10.3 },
  { hour: '13:00', filings: 29, clearances: 22, revenue_lakh: 6.7 },
  { hour: '14:00', filings: 67, clearances: 53, revenue_lakh: 14.5 },
  { hour: '15:00', filings: 79, clearances: 64, revenue_lakh: 16.1 },
  { hour: '16:00', filings: 36, clearances: 28, revenue_lakh: 8.9 },
  { hour: '17:00', filings: 58, clearances: 47, revenue_lakh: 12.4 },
  { hour: '18:00', filings: 72, clearances: 59, revenue_lakh: 15.8 },
  { hour: '19:00', filings: 48, clearances: 39, revenue_lakh: 10.9 },
  { hour: '20:00', filings: 81, clearances: 68, revenue_lakh: 17.6 },
  { hour: '21:00', filings: 63, clearances: 51, revenue_lakh: 13.8 },
  { hour: '22:00', filings: 55, clearances: 43, revenue_lakh: 12.1 },
  { hour: '23:00', filings: 40, clearances: 32, revenue_lakh: 9.2 },
]

const catDist = [
  { name: 'Electronics', value: 312 },
  { name: 'Textiles', value: 187 },
  { name: 'Auto Parts', value: 264 },
  { name: 'Pharmaceuticals', value: 198 },
  { name: 'Agricultural', value: 143 },
  { name: 'Machinery', value: 278 },
  { name: 'Chemical Products', value: 156 },
  { name: 'Gemstones', value: 221 },
]

const filterGroups = [
  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'duty_type', label: 'Duty Type', options: DUTY_TYPES.map(d => ({ value: d, label: d, count: 0 })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },
]

function CategoryBadge({ category }: { category: string }) {
  const color = category === 'Electronics' ? 'bg-yellow-500/15 text-yellow-400' : category === 'Textiles' ? 'bg-emerald-500/15 text-emerald-400' : category === 'Auto Parts' ? 'bg-sky-500/15 text-sky-400' : category === 'Pharmaceuticals' ? 'bg-rose-500/15 text-rose-400' : category === 'Agricultural' ? 'bg-lime-500/15 text-lime-400' : category === 'Machinery' ? 'bg-orange-500/15 text-orange-400' : category === 'Chemical Products' ? 'bg-purple-500/15 text-purple-400' : 'bg-cyan-500/15 text-cyan-400'
  return <span className={'cdc-cat-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{category}</span>
}

function PortBadge({ port }: { port: string }) {
  const color = port === 'Nhava Sheva JNPT' ? 'bg-blue-500/15 text-blue-400' : port === 'Chennai Port' ? 'bg-red-500/15 text-red-400' : port === 'Kandla Port' ? 'bg-amber-500/15 text-amber-400' : port === 'Kolkata Haldia' ? 'bg-emerald-500/15 text-emerald-400' : port === 'Mundra Port' ? 'bg-sky-500/15 text-sky-400' : port === 'Cochin Port' ? 'bg-teal-500/15 text-teal-400' : port === 'Vizag Port' ? 'bg-violet-500/15 text-violet-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'cdc-port-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{port}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Pending' ? 'bg-amber-500/15 text-amber-400' : status === 'Under Review' ? 'bg-blue-500/15 text-blue-400' : status === 'Assessed' ? 'bg-violet-500/15 text-violet-400' : status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
  return <span className={'cdc-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function DutyBar({ value, max }: { value: number; max: number }) {
  const w = Math.min((value / max) * 100, 100)
  const color = w >= 80 ? 'bg-yellow-500' : w >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
  return <div className='cdc-duty-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full cdc-duty-fill ' + color} style={{ width: w + '%', animation: 'cdc-grow 1s ease-out' }}/></div>
}

function RiskBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
  return <div className='cdc-risk-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full cdc-risk-fill ' + color} style={{ width: value + '%', animation: 'cdc-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='cdc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='cdc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='cdc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='cdc-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='cdc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 cdc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='cdc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Nhava Sheva JNPT Clearing Backlog', desc: 'Over 340 shipments pending customs assessment at JNPT due to monsoon-related container scanning equipment downtime. Average clearance time increased from 18 to 42 hours. Recommend deploying mobile X-ray units and activating emergency clearance protocols for perishable consignments. Revenue impact estimated at INR 2.4 Cr per day.', severity: 'high' },
  { title: 'Anti-Dumping Duty Reclassification Alert', desc: 'DGFT issued Notification 47/2026 reclassifying 18 HS codes under anti-dumping scope. Affected shipments from 4 SEZ units require reassessment. Automated duty calculator flagged 23 entries with potential INR 8.7L under-assessment. Compliance team notified for batch re-filing within 72-hour window.', severity: 'medium' },
  { title: 'Kandla Port E-Way Bill Integration', desc: 'ICEGATE integration with GST e-Way Bill system achieved 94% auto-reconciliation for Kandla-based imports. Manual verification reduced by 67%. Average GST clearance time improved from 6.2 to 1.8 hours. Rollout planned for Mundra and Cochin by August 2026. Estimated annual savings: INR 3.2 Cr in broker fees.', severity: 'low' },
  { title: 'AI Risk Scoring Model v3 Deployment', desc: 'Enhanced risk scoring model using shipment history, importer profile analytics, and real-time exchange rate volatility. Detection rate for duty evasion improved from 72% to 89%. False positive rate reduced to 8%. Integrated with ICEGATE for real-time risk classification on all Bill of Entry filings across 8 major ports.', severity: 'high' },
]

export default function CustomsDutyCommandView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = shipments.filter(s => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }
    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='cdc-root space-y-4 p-4'>
      <PageHeader title='Customs Duty Command' description='Import duty assessment, compliance tracking & risk scoring across Indian ports' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='cdc-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='cdc-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='shipments' className='cdc-tab'>Shipments</TabsTrigger>
          <TabsTrigger value='analytics' className='cdc-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='cdc-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='cdc-tab-content space-y-4 mt-4'>
          <div className='cdc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Pending Filings' value='1,247' sub='+89 today' color='text-yellow-400' />
            <KpiTile label='Avg Clearance' value='24.6 hrs' sub='-3.2 hrs improved' color='text-amber-400' />
            <KpiTile label='Duty Collected' value='INR 18.4 Cr' sub='+INR 2.1 Cr WoW' color='text-emerald-400' />
            <KpiTile label='Risk Score Avg' value='34.2' sub='-5.1 improved' color='text-cyan-400' />
          </div>
          <div className='cdc-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={92} label='Compliance' color='#eab308' />
            <HealthRing value={86} label='Auto Clear' color='#f59e0b' />
            <HealthRing value={78} label='Doc Complete' color='#84cc16' />
            <HealthRing value={91} label='e-Way Match' color='#06b6d4' />
            <HealthRing value={84} label='IGST Reconcile' color='#6366f1' />
            <HealthRing value={96} label='Audit Ready' color='#ec4899' />
          </div>
          <div className='cdc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='cdc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Filings/Clearances</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='filings' stroke='#eab308' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='clearances' stroke='#f59e0b' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='cdc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Revenue (Lakh INR)</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='revenue_lakh' fill='#84cc16' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='cdc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={catDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{catDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='shipments' className='cdc-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Customs Command' }, { label: 'Shipments' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={shipments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search shipments by ID, category, port...' />
          <Card className='cdc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='cdc-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='cdc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Port</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Status</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Duty (INR)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Risk</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Clearance</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>GST (INR)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Duty Type</th></tr></thead><tbody>
          {filtered.map(s => (
            <tr key={s.id} className='cdc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-yellow-400'>{s.id}</td>
              <td className='px-3 py-2'><CategoryBadge category={s.category} /></td>
              <td className='px-3 py-2'><PortBadge port={s.port} /></td>
              <td className='px-3 py-2'><StatusBadge status={s.status} /></td>
              <td className='px-3 py-2 w-24'><DutyBar value={s.duty_inr} max={9800000} /><span className='text-[10px] text-zinc-500 ml-1'>{(s.duty_inr / 100000).toFixed(1)}L</span></td>
              <td className='px-3 py-2 w-20'><RiskBar value={s.risk_score} /><span className='text-[10px] text-zinc-500 ml-1'>{s.risk_score}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{s.clearance_hrs}h</td>
              <td className='px-3 py-2 text-right text-xs'>{(s.gst_inr / 1000).toFixed(0)}K</td>
              <td className='px-3 py-2'><span className='text-[10px] text-zinc-400'>{s.duty_type}</span></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='cdc-tab-content space-y-4 mt-4'>
          <div className='cdc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Duty Collected' value='INR 184 Cr' change='+14% MoM' />
            <ValueTile label='Avg Processing Time' value='22.3 hrs' change='-8% faster' />
            <ValueTile label='Dispute Rate' value='3.2%' change='-0.8pp' />
            <ValueTile label='Exemption Claims' value='INR 12.7 Cr' change='+1 new' />
          </div>
          <div className='cdc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='cdc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Port Performance</CardTitle></CardHeader><CardContent><BarChart data={PORTS.map((p,i) => ({ name: p.split(' ')[0], clearance: [92,88,94,81,90,86,89,87][i], compliance: [98,95,99,93,97,94,96,95][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='clearance' fill='#eab308' radius={[4,4,0,0]}/><Bar dataKey='compliance' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='cdc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Duty Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Basic Customs', value: 35 }, { name: 'IGST', value: 28 }, { name: 'Social Welfare', value: 15 }, { name: 'Comp Cess', value: 10 }, { name: 'Anti-Dumping', value: 8 }, { name: 'Safeguard', value: 4 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#eab308' />, <Cell key={1} fill='#f59e0b' />, <Cell key={2} fill='#84cc16' />, <Cell key={3} fill='#06b6d4' />, <Cell key={4} fill='#6366f1' />, <Cell key={5} fill='#ec4899' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='cdc-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'cdc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-yellow-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'cdc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-yellow-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
