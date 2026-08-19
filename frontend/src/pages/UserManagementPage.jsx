import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, Shield, ShieldCheck, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Loader from '../components/common/Loader';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to load user directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-100">{row.name}</p>
            <p className="text-[11px] text-slate-400 font-mono">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono border ${
            row.role === 'admin'
              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              : row.role === 'officer'
              ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (row) => (
        <span className="font-mono text-xs text-slate-300">{row.phone}</span>
      ),
    },
    {
      header: 'Assigned Area / Village',
      accessor: 'assignedZone',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate max-w-[200px]">{row.location?.name || row.assignedZone}</span>
        </div>
      ),
    },
    {
      header: 'Badge / ID #',
      accessor: 'badgeNumber',
      render: (row) => (
        <span className="font-mono text-xs text-emerald-400">
          {row.badgeNumber || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
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
              Personnel & Community Directory
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Users className="w-3.5 h-3.5" />
              AUTHORITY MATRIX
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registered Forest Officers, Patrol Rangers, and Village Community Members
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        searchPlaceholder="Search personnel by name, email, phone, sector..."
        filters={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input py-1.5 px-3 text-xs"
          >
            <option value="all" className="bg-obsidian-900">All Roles</option>
            <option value="admin" className="bg-obsidian-900">🛡️ Admin Authorities</option>
            <option value="officer" className="bg-obsidian-900">🌲 Forest Officers / Rangers</option>
            <option value="resident" className="bg-obsidian-900">🏡 Village Residents</option>
          </select>
        }
      />
    </div>
  );
};

export default UserManagementPage;
