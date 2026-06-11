import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaFileAlt, FaDownload, FaEye, FaCheckCircle, FaFilePdf, FaFileImage } from "react-icons/fa";

const ACCENT = "#f97316";

export default function ViewDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => { setLoading(false); }, 5000);
    api.get("/student/documents")
      .then((data) => {
        clearTimeout(timeout);
        // If no docs from DB, show the ones from admission form stored in localStorage
        if (Array.isArray(data) && data.length > 0) {
          setDocs(data);
        } else {
          // fallback: try to get from profile which has admission data
          api.get("/student/profile").then((profile) => {
            const admDocs = profile?.admission?.documents || [];
            setDocs(admDocs);
          }).catch(() => setDocs([]));
        }
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setDocs([]);
        setLoading(false);
      });
    return () => clearTimeout(timeout);
  }, []);

  const download = (doc) => {
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.name;
    a.click();
  };

  const getIcon = (name) => {
    if (name?.toLowerCase().includes("pdf")) return <FaFilePdf style={{ color: "#dc2626" }} />;
    return <FaFileImage style={{ color: "#4f46e5" }} />;
  };

  if (loading) return <div style={s.loading}>Loading documents...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>My Documents</h2>
          <p style={s.sub}>Documents submitted during admission</p>
        </div>
        <div style={s.countBadge}>{docs.length} document{docs.length !== 1 ? "s" : ""}</div>
      </div>

      {docs.length === 0 ? (
        <div style={s.empty}>
          <FaFileAlt style={{ fontSize: "48px", color: "#d1d5db", marginBottom: "12px" }} />
          <p style={{ color: "#6b7280", fontWeight: "600" }}>No documents found</p>
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>Documents submitted during admission will appear here</p>
        </div>
      ) : (
        <div style={s.grid}>
          {docs.map((doc, i) => (
            <div key={i} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.fileIcon}>{getIcon(doc.fileUrl)}</div>
                <div style={s.fileInfo}>
                  <p style={s.fileName}>{doc.name}</p>
                  <div style={s.verifiedBadge}><FaCheckCircle style={{ marginRight: "4px" }} /> Submitted</div>
                </div>
              </div>
              {/* Preview thumbnail if image */}
              {doc.fileUrl?.startsWith("data:image") && (
                <img src={doc.fileUrl} alt={doc.name} style={s.thumb} onClick={() => setPreview(doc)} />
              )}
              {doc.fileUrl?.startsWith("data:application/pdf") && (
                <div style={s.pdfPlaceholder} onClick={() => setPreview(doc)}>
                  <FaFilePdf style={{ fontSize: "32px", color: "#dc2626" }} />
                  <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>PDF Document</span>
                </div>
              )}
              <div style={s.actions}>
                <button style={s.viewBtn} onClick={() => setPreview(doc)}><FaEye style={{ marginRight: "4px" }} />View</button>
                <button style={s.downloadBtn} onClick={() => download(doc)}><FaDownload style={{ marginRight: "4px" }} />Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div style={s.overlay} onClick={() => setPreview(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{preview.name}</span>
              <button style={s.closeBtn} onClick={() => setPreview(null)}>✕</button>
            </div>
            {preview.fileUrl?.startsWith("data:image") ? (
              <img src={preview.fileUrl} alt={preview.name} style={{ width: "100%", borderRadius: "8px" }} />
            ) : (
              <iframe src={preview.fileUrl} style={{ width: "100%", height: "500px", border: "none", borderRadius: "8px" }} title={preview.name} />
            )}
            <button style={s.dlBtn} onClick={() => download(preview)}><FaDownload style={{ marginRight: "6px" }} />Download</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
  countBadge: { background: "#fff7ed", color: ACCENT, padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: `1px solid #fed7aa` },
  empty: { background: "#fff", borderRadius: "16px", padding: "60px 24px", textAlign: "center", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "16px" },
  card: { background: "#fff", borderRadius: "14px", padding: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "12px" },
  cardTop: { display: "flex", alignItems: "center", gap: "10px" },
  fileIcon: { width: "40px", height: "40px", background: "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: "14px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  verifiedBadge: { display: "inline-flex", alignItems: "center", fontSize: "11px", color: "#16a34a", fontWeight: "600", marginTop: "4px" },
  thumb: { width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", border: "1px solid #e5e7eb" },
  pdfPlaceholder: { width: "100%", height: "80px", background: "#fef2f2", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #fecaca" },
  actions: { display: "flex", gap: "8px" },
  viewBtn: { flex: 1, padding: "8px", background: "#eef2ff", color: "#4f46e5", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" },
  downloadBtn: { flex: 1, padding: "8px", background: "#fff7ed", color: ACCENT, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  modal: { background: "#fff", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  modalTitle: { fontSize: "16px", fontWeight: "700", color: "#1e1b4b" },
  closeBtn: { background: "#f3f4f6", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "700", color: "#6b7280" },
  dlBtn: { width: "100%", padding: "11px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center" },
};
