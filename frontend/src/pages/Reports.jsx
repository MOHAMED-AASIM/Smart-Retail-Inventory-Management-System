import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { BarChart3, FileText, Download, Calendar, DollarSign, Package } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'sales' | 'performance'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/${type}`);
      setReportData(response.data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const handleExportCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (activeTab === 'inventory' && reportData.products) {
      csvContent += 'Product Name,Category,Price,Quantity,Min Stock,Total Valuation,Status\n';
      reportData.products.forEach(p => {
        csvContent += `"${p.productName}","${p.category}",${p.price},${p.quantity},${p.minStockLevel},${p.totalValue},"${p.status}"\n`;
      });
    } else if ((activeTab === 'sales' || activeTab === 'daily') && reportData.sales) {
      csvContent += 'Product Name,Quantity,Unit Price,Total Price,Sale Date,Staff\n';
      reportData.sales.forEach(s => {
        csvContent += `"${s.productName}",${s.quantity},${s.unitPrice},${s.totalPrice},"${new Date(s.saleDate).toISOString()}","${s.recordedBy}"\n`;
      });
    } else if (activeTab === 'performance' && reportData.topProducts) {
      csvContent += 'Product Name,Quantity Sold,Total Revenue\n';
      reportData.topProducts.forEach(p => {
        csvContent += `"${p.productName}",${p.quantitySold},${p.revenue}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_retail_${activeTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Navbar pageTitle="Business Reports & Analytics" />

      <div className="page-body">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10, background: 'rgba(15,23,42,0.6)', padding: 6, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Package size={16} />
              Inventory Valuation
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`btn ${activeTab === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <DollarSign size={16} />
              Sales Performance
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`btn ${activeTab === 'performance' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <BarChart3 size={16} />
              Top Products
            </button>
          </div>

          <button onClick={handleExportCSV} className="btn btn-emerald" disabled={!reportData}>
            <Download size={16} />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Report Content Container */}
        <div className="glass-card">
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Generating report analytics...</div>
          ) : !reportData ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>No report data available.</div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>{reportData.reportTitle}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Generated on {new Date(reportData.generatedAt).toLocaleString()}
                  </span>
                </div>

                {/* Summary Metrics */}
                {reportData.summary && (
                  <div style={{ display: 'flex', gap: 20 }}>
                    {reportData.summary.totalInventoryValue !== undefined && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Stock Valuation</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                          ${reportData.summary.totalInventoryValue.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {reportData.summary.totalRevenue !== undefined && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Sales Revenue</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6366f1' }}>
                          ${reportData.summary.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="data-table-container">
                {activeTab === 'inventory' && reportData.products && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Min Threshold</th>
                        <th>Valuation ($)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.products.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 700, color: 'white' }}>{p.productName}</td>
                          <td>{p.category}</td>
                          <td>${p.price.toFixed(2)}</td>
                          <td>{p.quantity} units</td>
                          <td>{p.minStockLevel} units</td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>${p.totalValue.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${p.status === 'Low Stock' ? 'badge-low-stock' : 'badge-optimal'}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'sales' && reportData.sales && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty Sold</th>
                        <th>Unit Price</th>
                        <th>Total Revenue</th>
                        <th>Date</th>
                        <th>Processed By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.sales.map(s => (
                        <tr key={s._id}>
                          <td style={{ fontWeight: 700, color: 'white' }}>{s.productName}</td>
                          <td>{s.quantity} units</td>
                          <td>${s.unitPrice.toFixed(2)}</td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>${s.totalPrice.toFixed(2)}</td>
                          <td style={{ color: '#94a3b8' }}>{new Date(s.saleDate).toLocaleString()}</td>
                          <td><span className="badge badge-employee">{s.recordedBy}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'performance' && reportData.topProducts && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Product Name</th>
                        <th>Units Sold</th>
                        <th>Gross Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topProducts.map((p, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 800, color: '#6366f1' }}>#{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: 'white' }}>{p.productName}</td>
                          <td>{p.quantitySold} units</td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>${p.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
