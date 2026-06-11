import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaUpload, FaCheckCircle, FaFileAlt, FaFilePdf, FaFileImage } from "react-icons/fa";

const ACCENT = "#f97316";

const requiredDocs = ["10th Marksheet", "12th Marksheet", "Transfer Certificate", "Aadhar Card", "Passport Photo"];

export default function UploadDocuments() {
  const [submittedDocs, setSubmittedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDocs, setNewDocs] = useState({});
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/student/documents").then((data) => {
      setSubmittedDocs(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleFile = (docName, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewDocs((prev) => ({ ...prev, [docName]: { name: file.name, fileUrl: reader.result } }));
    reader.readAsDataURL(file);
  };

  const isSubmitted = (docName) => submittedDocs.some((d) => d.name === docName);

  const handleUpload = () => {
    if (Object.keys(newDocs).length === 0) return;
    setUploading(true);
    setTimeout(() => {
      setSubmittedDocs((prev) => [...prev, ...Object.entries(newDocs).map(([name, val]) => ({ name, fileUrl: val.fileUrl }))]);
      setNewDocs({});
      setUploading(false);
      setSuccess("Documents uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  if (loading) return <div style={s.loading}>Loading...</div>;

  const allSubmitted = requiredDocs.every((d) => isSubmitted(d));

  return (
    <div style={s.page}>
      <h2 style={s.title}>Upload Documents</h2>
      <p style={s.sub}>Required documents for your admission record</p>

      {success && <div style={s.successMsg}><FaCheckCircle style={{ marginRight: "8px" }} />{success}</div>}

      {allSubmitted && (
        <div style={s.allDoneBox}>
          <FaCheckCircle style={{ fontSize: "20px", marginRight: "10px" }} />
          All required documents have been submitted successfully!
        </div>
      )}

      <div style={s.card}>
        <h3 style={s.cardTitle}>Required Documents</h3>
        {requiredDocs.map((doc) => {
          const submitted = isSubmitted(doc);
          const pending = newDocs[doc];
          return (
            <div key={doc} style={s.docRow}>
              <div style={s.docLeft}>
                <div style={s.docIcon(submitted)}>{submitted ? <FaCheckCircle /> : <FaFileAlt />}</div>
                <div>
                  <p style={s.docName}>{doc}</p>
                  <p style={s.docStatus(submitted)}>{submitted ? "✓ Submitted" : pending ? `Ready: ${pending.name}` : "Not uploaded"}</p>
                </div>
              </div>
              {!submitted && (
                <label style={s.uploadBtn(!!pending)}>
                  <FaUpload style={{ marginRight: "4px" }} />
                  {pending ? "Change" : "Upload"}
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFile(doc, e.target.files[0])} />
                </label>
              )}
            </div>
          );
        })}

        {Object.keys(newDocs).length > 0 && (
          <button style={s.submitBtn} onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : `Submit ${Object.keys(newDocs).length} Document(s)`}
          </button>
        )}
      </div>

      {/* Additional documents */}
      {submittedDocs.filter((d) => !requiredDocs.includes(d.name)).length > 0 && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>Additional Documents</h3>
          {submittedDocs.filter((d) => !requiredDocs.includes(d.name)).map((doc, i) => (
            <div key={i} style={s.docRow}>
              <div style={s.docLeft}>
                <div style={s.docIcon(true)}><FaCheckCircle /></div>
                <div>
                  <p style={s.docName}>{doc.name}</p>
                  <p style={s.docStatus(true)}>✓ Submitted</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: 0 },
  successMsg: { background: "#dcfce7", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 16px", color: "#16a34a", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center" },
  allDoneBox: { background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: "10px", padding: "14px 18px", color: "#0d9488", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center" },
  card: { background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardTitle: { fontSize: "15px", fontWeight: "800", color: "#1e1b4b", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` },
  docRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" },
  docLeft: { display: "flex", alignItems: "center", gap: "12px" },
  docIcon: (done) => ({ width: "36px", height: "36px", borderRadius: "10px", background: done ? "#dcfce7" : "#f3f4f6", color: done ? "#16a34a" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }),
  docName: { fontSize: "14px", fontWeight: "600", color: "#1e1b4b", margin: 0 },
  docStatus: (done) => ({ fontSize: "12px", color: done ? "#16a34a" : "#9ca3af", margin: "2px 0 0", fontWeight: "500" }),
  uploadBtn: (ready) => ({ padding: "7px 14px", background: ready ? "#fff7ed" : "#f8fafc", color: ready ? ACCENT : "#6b7280", border: `1px solid ${ready ? "#fed7aa" : "#e5e7eb"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center" }),
  submitBtn: { width: "100%", padding: "12px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px", marginTop: "16px" },
};
