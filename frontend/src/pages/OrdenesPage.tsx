import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { OrdenReparacion, OrdenReparacionInDto, EstadoOrden } from '../types/orden';
import type { Vehiculo } from '../types/vehiculo';
import { API_BASE_URL } from '../data/constants';
import ActionButton from '../components/ActionButton';
import './ClientesPage.css';
import './OrdenesPage.css';

const ESTADOS: EstadoOrden[] = ['PENDIENTE', 'EN_CURSO', 'FINALIZADO'];

const EMPTY: OrdenReparacionInDto = {
  descripcionAveria: '', estado: 'PENDIENTE', kilometros: 0,
  precioEstimado: 0, precioFinal: 0, matriculaVehiculo: '',
};

// Badge de estado — Gestalt Semejanza: color consistente, sin emojis
function StatusBadge({ estado }: { estado: EstadoOrden }) {
  const cls = estado === 'PENDIENTE' ? 'status-pendiente' : estado === 'EN_CURSO' ? 'status-en_curso' : 'status-finalizado';
  const label = estado === 'EN_CURSO' ? 'En curso' : estado === 'PENDIENTE' ? 'Pendiente' : 'Finalizado';
  return <span className={`status-badge ${cls}`}>{label}</span>;
}

const IconEdit = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconX = () => <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function OrdenesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matriculaFiltro = searchParams.get('matricula');

  const [ordenes, setOrdenes] = useState<OrdenReparacion[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OrdenReparacionInDto>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoOrden | 'TODOS'>('TODOS');

  const load = () => {
    setLoading(true);
    const url = matriculaFiltro
      ? `${API_BASE_URL}/vehiculos/${encodeURIComponent(matriculaFiltro)}/ordenes`
      : `${API_BASE_URL}/ordenes`;

    Promise.all([
      fetch(url).then((r) => r.json()),
      fetch(`${API_BASE_URL}/vehiculos`).then((r) => r.json()),
    ]).then(([o, v]) => { setOrdenes(Array.isArray(o) ? o : []); setVehiculos(v); })
      .catch(() => setError('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [matriculaFiltro]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, matriculaVehiculo: matriculaFiltro ?? (vehiculos[0]?.matricula ?? '') });
    setShowModal(true);
  };

  const openEdit = (o: OrdenReparacion) => {
    setEditingId(o.id);
    setForm({ descripcionAveria: o.descripcionAveria, estado: o.estado, fechaEntrada: o.fechaEntrada, fechaSalida: o.fechaSalida, kilometros: o.kilometros ?? 0, precioEstimado: o.precioEstimado ?? 0, precioFinal: o.precioFinal ?? 0, matriculaVehiculo: o.matriculaVehiculo });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta orden?')) return;
    await fetch(`${API_BASE_URL}/ordenes/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editingId ? `${API_BASE_URL}/ordenes/${editingId}` : `${API_BASE_URL}/ordenes`;
    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false); load();
    } catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: ['kilometros', 'precioEstimado', 'precioFinal'].includes(name) ? Number(value) : value }));
  };

  const ordenesFiltradas = ordenes.filter((o) =>
    estadoFiltro === 'TODOS' || o.estado === estadoFiltro
  );

  return (
    <main className="crud-page ordenes-page">
      <div className="container-xl px-4">
        <div className="page-top-bar">
          <div>
            <h2>Órdenes de reparación</h2>
            <p>{matriculaFiltro ? `Historial de matrícula: ${matriculaFiltro}` : 'Todas las órdenes del taller'}</p>
          </div>
          <button className="btn-primary-sti" onClick={openAdd}>
            <IconPlus /> Nueva orden
          </button>
        </div>

        <div className="historial-filter-bar">
          <div className="d-flex align-items-center gap-2">
            <select
              className="sti-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as any)}
              style={{ width: '180px' }}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_CURSO">En curso</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
            {matriculaFiltro && (
              <span>Filtrando matrícula: {matriculaFiltro} <small>({ordenesFiltradas.length} orden(es))</small></span>
            )}
          </div>
          {matriculaFiltro && (
            <button className="btn-clear-filter" onClick={() => navigate('/ordenes')}>
              <IconX /> Quitar filtro matrícula
            </button>
          )}
        </div>

        {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cargando...</p>}
        {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

        {!loading && !error && (
          <div className="table-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Vehículo</th>
                    <th>Km</th>
                    <th>P. Estimado</th>
                    <th>P. Final</th>
                    <th>Entrada</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 28, color: 'var(--text-muted)', fontSize: 13 }}>
                      {matriculaFiltro ? `Sin órdenes para ${matriculaFiltro}` : 'Sin registros'}
                    </td></tr>
                  ) : ordenesFiltradas.map((o) => (
                    <tr key={o.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{o.id}</td>
                      <td style={{ maxWidth: 220 }}>
                        <span title={o.descripcionAveria} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {o.descripcionAveria}
                        </span>
                      </td>
                      <td><StatusBadge estado={o.estado} /></td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{o.matriculaVehiculo}</span>
                        {o.marcaVehiculo && (
                          <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>
                            {o.marcaVehiculo} {o.modeloVehiculo}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                        {o.kilometros?.toLocaleString('es-ES') ?? '—'}
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {o.precioEstimado != null ? `${o.precioEstimado.toFixed(2)} €` : '—'}
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {o.precioFinal != null && o.precioFinal > 0 ? `${o.precioFinal.toFixed(2)} €` : '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {o.fechaEntrada ? new Date(o.fechaEntrada).toLocaleDateString('es-ES') : '—'}
                      </td>
                      <td className="text-end">
                        <div className="row-actions justify-content-end">
                          <ActionButton variant="primary" onClick={() => openEdit(o)} icon={<IconEdit />} text="Editar" />
                          <ActionButton variant="danger" onClick={() => handleDelete(o.id)} icon={<IconTrash />} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer-bar">{ordenesFiltradas.length} orden(es)</div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>{editingId ? 'Editar orden' : 'Nueva orden de reparación'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="sti-label">Descripción de la avería *</label>
                  <textarea name="descripcionAveria" className="sti-input" style={{ resize: 'vertical', minHeight: 70 }} value={form.descripcionAveria} onChange={handleChange} required rows={3} placeholder="Descripción técnica de la avería..." />
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Estado *</label>
                  <select name="estado" className="sti-select" value={form.estado} onChange={handleChange} required>
                    {ESTADOS.map((e) => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="sti-label">Vehículo *</label>
                  <select name="matriculaVehiculo" className="sti-select" value={form.matriculaVehiculo} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {vehiculos.map((v) => (
                      <option key={v.matricula} value={v.matricula}>{v.matricula} — {v.marca} {v.modelo}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="sti-label">Kilómetros</label>
                  <input name="kilometros" type="number" className="sti-input" value={form.kilometros} onChange={handleChange} min={0} />
                </div>
                <div className="col-md-4">
                  <label className="sti-label">Precio estimado (€)</label>
                  <input name="precioEstimado" type="number" step="0.01" className="sti-input" value={form.precioEstimado} onChange={handleChange} min={0} />
                </div>
                <div className="col-md-4">
                  <label className="sti-label">Precio final (€)</label>
                  <input name="precioFinal" type="number" step="0.01" className="sti-input" value={form.precioFinal} onChange={handleChange} min={0} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary-sti" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
