import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import ThreatBadge from '../components/common/ThreatBadge';
import StatusBadge from '../components/common/StatusBadge';
import { ANIMALS } from '../utils/constants';

export const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatFilter, setThreatFilter] = useState('all');
  const [animalFilter, setAnimalFilter] = useState('all');
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents?limit=100');
      if (res.success) {
        setIncidents(res.incidents);
      }
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (threatFilter !== 'all' && inc.threatLevel !== threatFilter) return false;
    if (animalFilter !== 'all' && inc.animal !== animalFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Incident ID',
      accessor: 'incidentId',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-emerald-400">{row.incidentId}</span>
      ),
    },
    {
      header: 'Wildlife Species',
      accessor: 'animal',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.detection?.image ? (
            <img
              src={row.detection.image}
              alt={row.animal}
              className="w-8 h-8 rounded-lg object-cover border border-forest-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-forest-850 flex items-center justify-center text-xs">🐾</div>
          )}
          <span className="font-bold text-slate-100">{row.animal}</span>
        </div>
      ),
    },
    {
      header: 'Threat Level',
      accessor: 'threatLevel',
      sortable: true,
      render: (row) => <ThreatBadge level={row.threatLevel} size="xs" />,
    },
    {
      header: 'Location / Sector',
      accessor: 'location',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300 max-w-[200px] truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{row.location}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Ranger',
      accessor: 'assignedOfficer',
      render: (row) => (
        <span className="text-xs text-slate-300">
          {row.assignedOfficer?.name || <span className="text-slate-500 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
    {
      header: 'Detection Time',
      accessor: 'createdAt',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Link
          to={`/incidents/${row._id}`}
          className="btn-outline py-1 px-2.5 text-xs flex items-center gap-1.5 hover:text-emerald-300"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Dossier</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Incident Management Log
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete record of verified animal intrusions, containment timelines, and ranger response notes
          </p>
        </div>

        <Link to="/reports" className="btn-secondary py-2 px-4 text-xs">
          <span>Generate Incident Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Incidents Table with Filters */}
      <DataTable
        columns={columns}
        data={filteredIncidents}
        loading={loading}
        searchPlaceholder="Search incidents by ID, species, location..."
        filters={
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input py-1.5 px-3 text-xs"
            >
              <option value="all" className="bg-obsidian-900">All Statuses</option>
              <option value="open" className="bg-obsidian-900">🔴 Open</option>
              <option value="investigating" className="bg-obsidian-900">🔵 Investigating</option>
              <option value="contained" className="bg-obsidian-900">🟡 Contained</option>
              <option value="resolved" className="bg-obsidian-900">🟢 Resolved</option>
            </select>

            <select
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value)}
              className="glass-input py-1.5 px-3 text-xs"
            >
              <option value="all" className="bg-obsidian-900">All Threats</option>
              <option value="CRITICAL" className="bg-obsidian-900">Critical</option>
              <option value="HIGH" className="bg-obsidian-900">High</option>
              <option value="MEDIUM" className="bg-obsidian-900">Medium</option>
              <option value="LOW" className="bg-obsidian-900">Low</option>
            </select>

            <select
              value={animalFilter}
              onChange={(e) => setAnimalFilter(e.target.value)}
              className="glass-input py-1.5 px-3 text-xs"
            >
              <option value="all" className="bg-obsidian-900">All Animals</option>
              {ANIMALS.map((a) => (
                <option key={a} value={a} className="bg-obsidian-900">
                  {a}
                </option>
              ))}
            </select>
          </>
        }
      />
    </div>
  );
};

export default IncidentsPage;
