import { useState, useEffect } from 'react';
import type { Cliente, ClienteInDto } from '../types/cliente';
import { API_BASE_URL } from '../data/constants';
import ActionButton from '../components/ActionButton';
import './ClientesPage.css';

const EMPTY: ClienteInDto = { dni: '', nombre: '', apellidos: '', email: '', telefono: '', direccion: '' };

const IconEdit = () => <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClienteInDto>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filtro, setFiltro] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/clientes`)
      .then((r) => r.json()).then(setClientes)
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c: Cliente) => {
    setEditingId(c.id);
    setForm({ dni: c.dni, nombre: c.nombre, apellidos: c.apellidos, email: c.email ?? '', telefono: c.telefono ?? '', direccion: c.direccion ?? '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    await fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editingId ? `${API_BASE_URL}/clientes/${editingId}` : `${API_BASE_URL}/clientes`;
    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); load();
    } catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
    c.dni.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="crud-page">
      <div className="container-xl px-4">
        <div className="page-top-bar">
          <div>
            <h2>Clientes</h2>
            <p>Gestión del registro de clientes del taller</p>
          </div>
          <button className="btn-primary-sti" onClick={openAdd}>
            <IconPlus /> Nuevo cliente
          </button>
        </div>

        {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cargando...</p>}
        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {!loading && !error && (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="sti-input"
                placeholder="Buscar por DNI, nombre o apellidos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </div>
            <div className="table-card">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Alta</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)', fontSize: 13 }}>Sin registros</td></tr>
                    ) : clientesFiltrados.map((c) => (
                      <tr key={c.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{c.id}</td>
                        <td><strong style={{ fontWeight: 600 }}>{c.dni}</strong></td>
                        <td>{c.nombre}</td>
                        <td>{c.apellidos}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{c.email ?? '—'}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{c.telefono ?? '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {c.fechaAlta ? new Date(c.fechaAlta).toLocaleDateString('es-ES') : '—'}
                        </td>
                        <td className="text-end">
                          <div className="row-actions justify-content-end">
                            <ActionButton variant="primary" onClick={() => openEdit(c)} icon={<IconEdit />} text="Editar" />
                            <ActionButton variant="danger" onClick={() => handleDelete(c.id)} icon={<IconTrash />} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer-bar">{clientesFiltrados.length} cliente(s)</div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>{editingId ? 'Editar cliente' : 'Nuevo cliente'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="sti-label">DNI *</label>
                  <input name="dni" className="sti-input" value={form.dni} onChange={handleChange} required placeholder="12345678A" />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Nombre *</label>
                  <input name="nombre" className="sti-input" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Apellidos *</label>
                  <input name="apellidos" className="sti-input" value={form.apellidos} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Email</label>
                  <input name="email" type="email" className="sti-input" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Teléfono</label>
                  <input name="telefono" className="sti-input" value={form.telefono} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="sti-label">Dirección</label>
                  <input name="direccion" className="sti-input" value={form.direccion} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary-sti" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
