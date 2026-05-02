import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehiculo, VehiculoInDto } from '../types/vehiculo';
import type { Cliente } from '../types/cliente';
import { API_BASE_URL } from '../data/constants';
import ActionButton from '../components/ActionButton';
import './ClientesPage.css';
import './VehiculosPage.css';

const EMPTY: VehiculoInDto = { matricula: '', marca: '', modelo: '', anio: new Date().getFullYear(), color: '', clienteId: 0 };

const IconEdit = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>;
const IconList = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMatricula, setEditingMatricula] = useState<string | null>(null);
  const [form, setForm] = useState<VehiculoInDto>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/vehiculos`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/clientes`).then((r) => r.json()),
    ]).then(([v, c]) => { setVehiculos(v); setClientes(c); })
      .catch(() => setError('Error al cargar'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingMatricula(null); setForm({ ...EMPTY, clienteId: clientes[0]?.id ?? 0 }); setShowModal(true); };
  const openEdit = (v: Vehiculo) => {
    setEditingMatricula(v.matricula);
    setForm({ matricula: v.matricula, marca: v.marca, modelo: v.modelo, anio: v.anio, color: v.color ?? '', clienteId: v.clienteId });
    setShowModal(true);
  };

  const handleDelete = async (matricula: string) => {
    if (!confirm(`¿Eliminar vehículo ${matricula}?`)) return;
    await fetch(`${API_BASE_URL}/vehiculos/${matricula}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editingMatricula ? `${API_BASE_URL}/vehiculos/${editingMatricula}` : `${API_BASE_URL}/vehiculos`;
    try {
      const res = await fetch(url, { method: editingMatricula ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); load();
    } catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'anio' || name === 'clienteId' ? Number(value) : value }));
  };

  const vehiculosFiltrados = vehiculos.filter(v =>
    v.matricula.toLowerCase().includes(filtro.toLowerCase()) ||
    v.marca.toLowerCase().includes(filtro.toLowerCase()) ||
    v.modelo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main className="crud-page vehiculos-page">
      <div className="container-xl px-4">
        <div className="page-top-bar">
          <div>
            <h2>Vehículos</h2>
            <p>Vehículos registrados y vinculados a clientes</p>
          </div>
          <button className="btn-primary-sti" onClick={openAdd}>
            <IconPlus /> Nuevo vehículo
          </button>
        </div>

        {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cargando...</p>}
        {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="sti-input"
                placeholder="Buscar por matrícula, marca o modelo..."
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
                      <th>Matrícula</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Año</th>
                      <th>Color</th>
                      <th>Cliente</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculosFiltrados.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: 28, color: 'var(--text-muted)', fontSize: 13 }}>Sin registros</td></tr>
                    ) : vehiculosFiltrados.map((v) => (
                      <tr key={v.matricula}>
                        <td><strong style={{ fontWeight: 600, letterSpacing: '0.03em' }}>{v.matricula}</strong></td>
                        <td>{v.marca}</td>
                        <td>{v.modelo}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{v.anio}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{v.color ?? '—'}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                          {v.clienteNombre ? `${v.clienteNombre} ${v.clienteApellidos ?? ''}` : `#${v.clienteId}`}
                        </td>
                        <td className="text-end">
                          <div className="row-actions justify-content-end">
                            <ActionButton onClick={() => navigate(`/ordenes?matricula=${v.matricula}`)} icon={<IconList />} text="Historial" />
                            <ActionButton variant="primary" onClick={() => openEdit(v)} icon={<IconEdit />} text="Editar" />
                            <ActionButton variant="danger" onClick={() => handleDelete(v.matricula)} icon={<IconTrash />} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer-bar">{vehiculosFiltrados.length} vehículo(s)</div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>{editingMatricula ? 'Editar vehículo' : 'Nuevo vehículo'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sti-label">Matrícula *</label>
                  <input name="matricula" className="sti-input" value={form.matricula} onChange={handleChange} required disabled={!!editingMatricula} placeholder="1234ABC" style={{ textTransform: 'uppercase' }} />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Cliente *</label>
                  <select name="clienteId" className="sti-select" value={form.clienteId} onChange={handleChange} required>
                    <option value={0} disabled>Seleccionar...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} {c.apellidos} — {c.dni}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Marca *</label>
                  <input name="marca" className="sti-input" value={form.marca} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Modelo *</label>
                  <input name="modelo" className="sti-input" value={form.modelo} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="sti-label">Año</label>
                  <input name="anio" type="number" className="sti-input" value={form.anio} onChange={handleChange} min={1900} max={2100} />
                </div>
                <div className="col-md-8">
                  <label className="sti-label">Color</label>
                  <input name="color" className="sti-input" value={form.color} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary-sti" disabled={saving}>
                  {saving ? 'Guardando...' : editingMatricula ? 'Guardar cambios' : 'Crear vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
