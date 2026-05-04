import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="sti-footer">
      <p>© {currentYear} STI — Sistema de Talleres Integrado · Raúl Prada Devesa · Grado Superior DAM (2º ONLINE)</p>
    </footer>
  );
}
