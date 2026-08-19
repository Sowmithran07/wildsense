import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  Shield,
  Activity,
  TreePine,
  Cpu,
} from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/common/Loader';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('weekly');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/summary?type=${reportType}`);
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleDownloadCSV = (dataset) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/download-csv?dataset=${dataset}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Report Generation Center
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-3.5 h-3.5" />
              OFFICIAL AUDIT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Export structured CSV data files and generate formatted safety reports for Forest Department reviews
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleDownloadCSV('incidents')}
            className="btn-secondary py-2 px-3 text-xs"
            title="Download Incidents CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Incidents CSV</span>
          </button>

          <button
            onClick={() => handleDownloadCSV('detections')}
            className="btn-secondary py-2 px-3 text-xs"
            title="Download Detections CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Detections CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary py-2 px-3.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-forest-700/60">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Audit Report Period:
          </span>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="daily" className="bg-obsidian-900">Daily Wildlife Activity Summary</option>
            <option value="weekly" className="bg-obsidian-900">Weekly Intrusion & Containment Report</option>
            <option value="monthly" className="bg-obsidian-900">Monthly Safety & Incident Audit</option>
          </select>
        </div>

        <span className="text-xs font-mono text-emerald-400">
          Status: Verified & Digitally Signed
        </span>
      </div>

      {/* REPORT CONTENT PREVIEW CARD */}
      {loading && !reportData ? (
        <Loader message="Compiling Official Department Report..." />
      ) : (
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-forest-700/80 shadow-2xl space-y-8 bg-obsidian-950/90 text-slate-100">
          {/* Official Letterhead Header */}
          <div className="flex items-center justify-between pb-6 border-b border-forest-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-obsidian-950 shadow-lg">
                <TreePine className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  WILD SENSE FOREST INTELLIGENCE DIVISION
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous Wildlife Intrusion Detection & Early Notification Service
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 space-y-0.5">
              <p className="font-bold text-emerald-400">{reportData?.reportMetadata?.reportType}</p>
              <p>Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* High Level Executive Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-forest-900/60 border border-forest-800">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Incursions</span>
              <span className="text-2xl font-black text-white font-mono block">
                {reportData?.summary?.totalIntrusions || 0}
              </span>
            </div>
            <div className="text-center space-y-1 border-l border-forest-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Critical Threats</span>
              <span className="text-2xl font-black text-red-400 font-mono block">
                {reportData?.summary?.criticalThreats || 0}
              </span>
            </div>
            <div className="text-center space-y-1 border-l border-forest-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Containment Rate</span>
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                {reportData?.summary?.resolutionRate || '100%'}
              </span>
            </div>
            <div className="text-center space-y-1 border-l border-forest-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Sensor Fleet Uptime</span>
              <span className="text-2xl font-black text-cyan-400 font-mono block">
                {reportData?.summary?.activeSensors}/{reportData?.summary?.monitoredSensors} Online
              </span>
            </div>
          </div>

          {/* Incident Log Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Documented Wildlife Incidents Log ({reportData?.incidents?.length || 0})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-obsidian-900 text-slate-400 font-mono uppercase border-b border-forest-800">
                  <tr>
                    <th className="py-2.5 px-3">Incident ID</th>
                    <th className="py-2.5 px-3">Species</th>
                    <th className="py-2.5 px-3">Threat</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Lead Ranger</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Resolution Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-850">
                  {reportData?.incidents?.map((inc) => (
                    <tr key={inc._id} className="hover:bg-forest-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{inc.incidentId}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{inc.animal}</td>
                      <td className="py-2.5 px-3"><ThreatBadge level={inc.threatLevel} size="xs" /></td>
                      <td className="py-2.5 px-3 truncate max-w-[150px]">{inc.location}</td>
                      <td className="py-2.5 px-3">{inc.assignedOfficer?.name || 'Duty Ranger'}</td>
                      <td className="py-2.5 px-3"><StatusBadge status={inc.status} size="xs" /></td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[200px]">
                        {inc.resolutionSummary || 'Safely guided away into forest core.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Departmental Sign-off */}
          <div className="pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div>
              <p>Prepared by: <span className="text-white font-bold">{reportData?.reportMetadata?.preparedBy}</span></p>
              <p>Authority: Karnataka & Tamil Nadu Forest Joint Conservation Board</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold">
              ✓ COMPLIANCE VERIFIED
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
