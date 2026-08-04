'use client';

import { useEffect, useState } from 'react';
import { Mail, Plus, X, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'student',
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    const supabase = createClient();
    const { data } = await supabase
      .from('invitations')
      .select('id, email, role, status, token, created_at, expires_at')
      .order('created_at', { ascending: false });
    setInvitations(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error } = await supabase.from('invitations').insert({
      email: formData.email,
      role: formData.role,
      status: 'pending',
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    const link = `${window.location.origin}/invite/${token}`;
    setCreatedLink(link);
    setFormData({ email: '', role: 'student' });
    setSubmitting(false);
    fetchInvitations();
  }

  async function handleRevoke(invitationId: string) {
    if (!confirm('¿Estás seguro de revocar esta invitación?')) return;

    const supabase = createClient();
    await supabase
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('id', invitationId);
    fetchInvitations();
  }

  function handleCopy() {
    navigator.clipboard.writeText(createdLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCloseModal() {
    setShowModal(false);
    setCreatedLink('');
    setCopied(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6D5A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail size={24} className="text-[#FF6D5A]" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invitaciones
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#FF6D5A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#FF6D5A]/90"
        >
          <Plus size={18} />
          Nueva Invitación
        </button>
      </div>

      <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/5 dark:border-white/10 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Email
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Rol
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Estado
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Creada
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Expira
                </th>
                <th className="pb-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {invitations.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {inv.email}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full bg-[#FF6D5A]/10 px-2 py-0.5 text-xs font-medium text-[#FF6D5A]">
                      {inv.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        inv.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : inv.status === 'accepted'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(inv.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(inv.expires_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 text-right">
                    {inv.status === 'pending' && (
                      <button
                        onClick={() => handleRevoke(inv.id)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                      >
                        Revocar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay invitaciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 backdrop-blur-xl bg-white/90 border border-gray-200/50 shadow-2xl dark:bg-gray-900/90 dark:border-white/10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nueva Invitación
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>
            {!createdLink ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#FF6D5A] dark:border-white/20 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#FF6D5A] dark:border-white/20 dark:bg-white/5 dark:text-white"
                  >
                    <option value="student">Estudiante</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#FF6D5A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#FF6D5A]/90 disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Invitación'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invitación creada. Comparte este enlace:
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-3 dark:border-white/20 dark:bg-white/5">
                  <input
                    type="text"
                    readOnly
                    value={createdLink}
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none dark:text-white"
                  />
                  <button
                    onClick={handleCopy}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
