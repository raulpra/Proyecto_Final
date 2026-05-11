import { useState, useEffect } from 'react';
import type { Usuario, UsuarioInDto } from '../types/usuario';
import { API_BASE_URL } from '../data/constants';
import ActionButton from '../components/ActionButton';
import './ClientesPage.css';

const EMPTY: UsuarioInDto = { username: '', password: '', nombre: '', rol: 'TECNICO', activo: true };

const IconEdit = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<UsuarioInDto>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filtro, setFiltro] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/usuarios`)
      .then((r) => r.json()).then(setUsuarios)
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (u: Usuario) => {
    setEditingId(u.id);
    setForm({ username: u.username, password: '', nombre: u.nombre, rol: u.rol, activo: u.activo });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editingId ? `${API_BASE_URL}/usuarios/${editingId}` : `${API_BASE_URL}/usuarios`;
    try {
      const payload = { ...form };
      if (editingId && !payload.password) {
      }
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setShowModal(false); load();
    } catch { alert('Error al guardar. Asegúrate de rellenar la contraseña y que el usuario no exista.'); }
    finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.username.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="crud-page">
      <div className="container-xl px-4">
        <div className="page-top-bar">
          <div>
            <h2>Gestión de Usuarios</h2>
            <p>Alta y modificación de mecánicos y administradores</p>
          </div>
          <button className="btn-primary-sti" onClick={openAdd}>
            <IconPlus /> Nuevo usuario
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
                placeholder="Buscar por nombre o usuario..."
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
                      <th>Usuario (Login)</th>
                      <th>Nombre Completo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)', fontSize: 13 }}>Sin registros</td></tr>
                    ) : usuariosFiltrados.map((u) => (
                      <tr key={u.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{u.id}</td>
                        <td><strong style={{ fontWeight: 600 }}>{u.username}</strong></td>
                        <td>{u.nombre}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: u.rol === 'ADMIN' ? '#fee2e2' : '#e0e7ff',
                            color: u.rol === 'ADMIN' ? '#991b1b' : '#3730a3',
                            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                          }}>
                            {u.rol === 'ADMIN' && <IconShield />}
                            {u.rol}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: u.activo ? 'var(--state-finalizado-dot)' : 'var(--state-pendiente-dot)', fontWeight: 600, fontSize: '12px' }}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="row-actions justify-content-end">
                            <ActionButton variant="primary" onClick={() => openEdit(u)} icon={<IconEdit />} text="Editar" />
                            {u.username !== 'admin' && (
                              <ActionButton variant="danger" onClick={() => handleDelete(u.id)} icon={<IconTrash />} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer-bar">{usuariosFiltrados.length} usuario(s)</div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>{editingId ? 'Editar usuario' : 'Nuevo usuario'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sti-label">Nombre Completo *</label>
                  <input name="nombre" className="sti-input" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Nombre de Usuario (Login) *</label>
                  <input name="username" className="sti-input" value={form.username} onChange={handleChange} required disabled={!!editingId && form.username === 'admin'} />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Rol *</label>
                  <select name="rol" className="sti-select" value={form.rol} onChange={handleChange} required disabled={!!editingId && form.username === 'admin'}>
                    <option value="TECNICO">Técnico (Mecánico)</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="sti-label">{editingId ? 'Nueva Contraseña' : 'Contraseña *'}</label>
                  <input name="password" type="password" className="sti-input" value={form.password} onChange={handleChange} required={!editingId || true /* Backend exige password siempre por el DTO */} placeholder={editingId ? 'Actualizar contraseña...' : '********'} />
                </div>
                <div className="col-12 mt-3">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} disabled={!!editingId && form.username === 'admin'} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Cuenta activa (puede iniciar sesión)</span>
                  </label>
                </div>
              </div>
              <div className="modal-actions mt-4">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary-sti" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
