import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaUpload, FaCheckCircle, FaCreditCard, FaMobileAlt, FaUniversity } from "react-icons/fa";
import { API_BASE_URL } from "../api";

const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics", "Chemical", "IT"];
const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "English", "Management"];
const requiredDocs = {
  student: ["10th Marksheet", "12th Marksheet", "Transfer Certificate", "Aadhar Card", "Passport Photo"],
  staff: ["Resume/CV", "Degree Certificate", "Experience Letter", "Aadhar Card", "Passport Photo"],
};

const FEES = {
  student: { admission: 5000, registration: 1000 },
  staff: { admission: 0, registration: 500 },
};
const HOSTEL_FEE = 2000;
const TRANSPORT_FEE = 1000;
const TRANSPORT_ROUTES = [
  "Route 1 — City Center to Campus",
  "Route 2 — Railway Station to Campus",
  "Route 3 — Jalgaon to Campus",
  "Route 4 — Erandol to Campus",
  "Route 5 — Bhusawal to Campus",
];

const STEPS = ["Details", "Documents", "Hostel", "Payment", "Review"];

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", dob: "", gender: "", branch: "", doa: "", previousSchool: "", parentName: "", parentEmail: "", parentPhone: "", department: "", designation: "" });
  const [hostelRequired, setHostelRequired] = useState(false);
  const [hostelPreference, setHostelPreference] = useState("");
  const [transportRequired, setTransportRequired] = useState(false);
  const [transportRoute, setTransportRoute] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [payment, setPayment] = useState({ method: "", cardNumber: "", cardName: "", expiry: "", cvv: "", upiId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePay = (e) => setPayment({ ...payment, [e.target.name]: e.target.value });

  const totalFee = FEES[role].admission + FEES[role].registration + (hostelRequired ? HOSTEL_FEE : 0) + (transportRequired ? TRANSPORT_FEE : 0);

  const handleFileUpload = (docName, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedDocs((prev) => ({ ...prev, [docName]: { name: file.name, fileUrl: reader.result } }));
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    setError("");
    if (step === 0) {
      if (!form.fullName || !form.email || !form.phone || !form.dob || !form.gender)
        return setError("Please fill all required fields.");
      if (role === "student" && !form.branch) return setError("Please select a branch.");
      if (role === "student" && (!form.parentName || !form.parentEmail || !form.parentPhone)) return setError("Please fill all parent details.");
      if (role === "staff" && (!form.department || !form.designation)) return setError("Please fill department and designation.");
    }
    if (step === 1) {
      const missing = requiredDocs[role].filter((d) => !uploadedDocs[d]);
      if (missing.length > 0) return setError(`Please upload: ${missing.join(", ")}`);
    }
    if (step === 2 && hostelRequired && !hostelPreference)
      return setError("Please select room preference.");
    if (step === 2 && transportRequired && !transportRoute)
      return setError("Please select a transport route.");
    if (step === 3) {
      if (!payment.method) return setError("Please select a payment method.");
      if (payment.method === "card" && (!payment.cardNumber || !payment.cardName || !payment.expiry || !payment.cvv))
        return setError("Please fill all card details.");
      if (payment.method === "upi" && !payment.upiId)
        return setError("Please enter UPI ID.");
    }
    setStep((p) => p + 1);
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const transactionId = "TXN" + Date.now();
      const body = {
        ...form, role,
        hostelRequired, hostelPreference: hostelRequired ? hostelPreference : "", hostelStatus: hostelRequired ? "pending" : "not_requested",
        transportRequired, transportRoute: transportRequired ? transportRoute : "",
        documents: Object.entries(uploadedDocs).map(([name, val]) => ({ name, fileUrl: val.fileUrl })),
        paymentStatus: "paid", paymentAmount: totalFee, paymentMethod: payment.method, paymentDate: new Date(), transactionId,
      };
      const res = await fetch(`${API_BASE_URL}/api/admission/apply`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setSubmitted(true);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.success}>
          <div style={s.successIcon}><FaCheckCircle /></div>
          <div style={s.successTitle}>Application & Payment Successful!</div>
          <div style={s.successSub}>
            Your admission application has been received and payment of <b>₹{totalFee.toLocaleString()}</b> is confirmed.<br />
            The admin will review and send your login credentials once approved.
          </div>
          <button style={s.backBtn} onClick={() => navigate("/")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.icon}><FaGraduationCap /></div>
          <div style={s.title}>Admission Application</div>
          <div style={s.sub}>Fill in your details to apply</div>
        </div>

        {/* Stepper */}
        <div style={s.stepper}>
          {STEPS.map((label, i) => (
            <div key={i} style={s.stepItem}>
              <div style={s.stepCircle(i <= step, i === step)}>{i < step ? "✓" : i + 1}</div>
              <div style={s.stepLabel(i === step)}>{label}</div>
              {i < STEPS.length - 1 && <div style={s.stepLine(i < step)} />}
            </div>
          ))}
        </div>

        {error && <div style={s.err}>{error}</div>}

        {/* STEP 0 — Details */}
        {step === 0 && (
          <div style={s.section}>
            <div style={s.sectionTitle}>Applying As</div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button type="button" style={s.roleBtn(role === "student")} onClick={() => setRole("student")}>🎓 Student</button>
              <button type="button" style={s.roleBtn(role === "staff")} onClick={() => setRole("staff")}>👨‍🏫 Staff</button>
            </div>
            <div style={s.sectionTitle}>Personal Information</div>
            <div style={s.grid}>
              <div style={s.group}><label style={s.label}>Full Name *</label><input style={s.input} name="fullName" value={form.fullName} onChange={handle} placeholder="Enter full name" /></div>
              <div style={s.group}><label style={s.label}>Email *</label><input style={s.input} name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" /></div>
              <div style={s.group}><label style={s.label}>Phone *</label><input style={s.input} name="phone" value={form.phone} onChange={handle} placeholder="10-digit number" /></div>
              <div style={s.group}><label style={s.label}>Date of Birth *</label><input style={s.input} name="dob" type="date" value={form.dob} onChange={handle} /></div>
              <div style={s.group}>
                <label style={s.label}>Gender *</label>
                <select style={s.select} name="gender" value={form.gender} onChange={handle}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={s.sectionTitle}>{role === "student" ? "Academic Details" : "Professional Details"}</div>
            <div style={s.grid}>
              {role === "student" ? (<>
                <div style={s.group}><label style={s.label}>Branch *</label>
                  <select style={s.select} name="branch" value={form.branch} onChange={handle}>
                    <option value="">Select branch</option>
                    {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={s.group}><label style={s.label}>Date of Admission *</label>
                  <input style={s.input} name="doa" type="date" value={form.doa} onChange={handle} />
                </div>
                <div style={{ ...s.group, gridColumn: "1/-1" }}><label style={s.label}>Previous School/College</label><input style={s.input} name="previousSchool" value={form.previousSchool} onChange={handle} placeholder="Previous institution" /></div>
              </>) : (<>
                <div style={s.group}><label style={s.label}>Department *</label>
                  <select style={s.select} name="department" value={form.department} onChange={handle}>
                    <option value="">Select department</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={s.group}><label style={s.label}>Designation *</label><input style={s.input} name="designation" value={form.designation} onChange={handle} placeholder="e.g. Assistant Professor" /></div>
              </>)}
            </div>
            {role === "student" && (
              <>
                <div style={s.sectionTitle}>👨‍👩‍👦 Parent / Guardian Details</div>
                <div style={s.grid}>
                  <div style={s.group}><label style={s.label}>Parent Name *</label><input style={s.input} name="parentName" value={form.parentName} onChange={handle} placeholder="Parent full name" /></div>
                  <div style={s.group}><label style={s.label}>Parent Email *</label><input style={s.input} name="parentEmail" type="email" value={form.parentEmail} onChange={handle} placeholder="parent@email.com" /></div>
                  <div style={s.group}><label style={s.label}>Parent WhatsApp No *</label><input style={s.input} name="parentPhone" value={form.parentPhone} onChange={handle} placeholder="10-digit WhatsApp number" /></div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 1 — Documents */}
        {step === 1 && (
          <div style={s.section}>
            <div style={s.sectionTitle}>Required Documents</div>
            {requiredDocs[role].map((doc) => (
              <div key={doc} style={s.docRow}>
                <span style={s.docName}>{doc}</span>
                {uploadedDocs[doc] ? (
                  <span style={s.uploaded}><FaCheckCircle /> {uploadedDocs[doc].name}</span>
                ) : (
                  <label style={s.uploadBtn}>
                    <FaUpload style={{ marginRight: "4px" }} /> Upload
                    <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(doc, e.target.files[0])} />
                  </label>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 — Services */}
        {step === 2 && (
          <div style={s.section}>
            {role !== "student" ? (
              <p style={{ color: "#666", fontSize: "14px", padding: "20px", textAlign: "center" }}>Additional services are only available for students.</p>
            ) : (
              <>
                {/* Hostel */}
                <div style={s.sectionTitle}>🏠 Hostel (Optional)</div>
                <div style={s.serviceCard(hostelRequired)}>
                  <div style={s.serviceTop}>
                    <div style={s.serviceInfo}>
                      <p style={s.serviceName}>Hostel Accommodation</p>
                      <p style={s.serviceDesc}>On-campus hostel with meals, Wi-Fi and security</p>
                      <p style={s.servicePrice}>Registration: <b>₹{HOSTEL_FEE.toLocaleString()}</b> + Monthly rent</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="button" style={s.yesBtn(hostelRequired)} onClick={() => setHostelRequired(true)}>Yes</button>
                      <button type="button" style={s.noBtn(!hostelRequired)} onClick={() => { setHostelRequired(false); setHostelPreference(""); }}>No</button>
                    </div>
                  </div>
                  {hostelRequired && (
                    <div style={{ marginTop: "12px" }}>
                      <label style={s.label}>Room Preference</label>
                      <select style={s.select} value={hostelPreference} onChange={(e) => setHostelPreference(e.target.value)}>
                        <option value="">Select room type</option>
                        <option value="single">Single Room — ₹3,000/month</option>
                        <option value="double">Double Sharing — ₹2,000/month</option>
                        <option value="triple">Triple Sharing — ₹1,500/month</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Transport */}
                <div style={s.sectionTitle}>🚌 Transport (Optional)</div>
                <div style={s.serviceCard(transportRequired)}>
                  <div style={s.serviceTop}>
                    <div style={s.serviceInfo}>
                      <p style={s.serviceName}>Bus Transport Facility</p>
                      <p style={s.serviceDesc}>Daily pickup & drop from your location to campus</p>
                      <p style={s.servicePrice}>Registration: <b>₹{TRANSPORT_FEE.toLocaleString()}</b> + Semester charges</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="button" style={s.yesBtn(transportRequired)} onClick={() => setTransportRequired(true)}>Yes</button>
                      <button type="button" style={s.noBtn(!transportRequired)} onClick={() => { setTransportRequired(false); setTransportRoute(""); }}>No</button>
                    </div>
                  </div>
                  {transportRequired && (
                    <div style={{ marginTop: "12px" }}>
                      <label style={s.label}>Select Route</label>
                      <select style={s.select} value={transportRoute} onChange={(e) => setTransportRoute(e.target.value)}>
                        <option value="">Select your route</option>
                        {TRANSPORT_ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {(hostelRequired || transportRequired) && (
                  <div style={s.feeNote}>
                    💰 Additional charges added to payment:
                    {hostelRequired && <span style={{ marginLeft: "8px" }}>Hostel ₹{HOSTEL_FEE.toLocaleString()}</span>}
                    {transportRequired && <span style={{ marginLeft: "8px" }}>Transport ₹{TRANSPORT_FEE.toLocaleString()}</span>}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STEP 3 — Payment */}
        {step === 3 && (
          <div style={s.section}>
            <div style={s.sectionTitle}>💳 Payment</div>

            {/* Fee Breakdown */}
            <div style={s.feeBox}>
              <div style={s.feeTitle}>Fee Breakdown</div>
              <div style={s.feeRow}><span>Admission Fee</span><span>₹{FEES[role].admission.toLocaleString()}</span></div>
              <div style={s.feeRow}><span>Registration Fee</span><span>₹{FEES[role].registration.toLocaleString()}</span></div>
              {hostelRequired && <div style={s.feeRow}><span>Hostel Registration</span><span>₹{HOSTEL_FEE.toLocaleString()}</span></div>}
              {transportRequired && <div style={s.feeRow}><span>Transport Registration</span><span>₹{TRANSPORT_FEE.toLocaleString()}</span></div>}
              <div style={s.feeDivider} />
              <div style={{ ...s.feeRow, fontWeight: "800", fontSize: "16px", color: "#003566" }}>
                <span>Total Amount</span><span>₹{totalFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={s.sectionTitle}>Select Payment Method</div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              {[
                { key: "card", label: "Card", icon: <FaCreditCard /> },
                { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
                { key: "netbanking", label: "Net Banking", icon: <FaUniversity /> },
              ].map((m) => (
                <button key={m.key} type="button" style={s.methodBtn(payment.method === m.key)} onClick={() => setPayment({ ...payment, method: m.key })}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {payment.method === "card" && (
              <div style={s.grid}>
                <div style={{ ...s.group, gridColumn: "1/-1" }}><label style={s.label}>Card Number</label><input style={s.input} name="cardNumber" value={payment.cardNumber} onChange={handlePay} placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                <div style={{ ...s.group, gridColumn: "1/-1" }}><label style={s.label}>Cardholder Name</label><input style={s.input} name="cardName" value={payment.cardName} onChange={handlePay} placeholder="Name on card" /></div>
                <div style={s.group}><label style={s.label}>Expiry</label><input style={s.input} name="expiry" value={payment.expiry} onChange={handlePay} placeholder="MM/YY" maxLength={5} /></div>
                <div style={s.group}><label style={s.label}>CVV</label><input style={s.input} name="cvv" value={payment.cvv} onChange={handlePay} placeholder="•••" maxLength={3} type="password" /></div>
              </div>
            )}
            {payment.method === "upi" && (
              <div style={s.group}><label style={s.label}>UPI ID</label><input style={s.input} name="upiId" value={payment.upiId} onChange={handlePay} placeholder="yourname@upi" /></div>
            )}
            {payment.method === "netbanking" && (
              <div style={s.group}>
                <label style={s.label}>Select Bank</label>
                <select style={s.select} name="bank" onChange={handlePay}>
                  <option value="">Select your bank</option>
                  {["SBI", "HDFC", "ICICI", "Axis", "PNB", "Bank of Baroda", "Canara Bank"].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Review */}
        {step === 4 && (
          <div style={s.section}>
            <div style={s.sectionTitle}>Review Your Application</div>
            <div style={s.reviewGrid}>
              <div style={s.reviewCard}>
                <div style={s.reviewTitle}>Personal Info</div>
                {[["Name", form.fullName], ["Email", form.email], ["Phone", form.phone], ["Gender", form.gender], ["DOB", form.dob]].map(([k, v]) => (
                  <div key={k} style={s.reviewRow}><span style={s.reviewKey}>{k}</span><span style={s.reviewVal}>{v || "-"}</span></div>
                ))}
              </div>
              <div style={s.reviewCard}>
                <div style={s.reviewTitle}>{role === "student" ? "Academic" : "Professional"}</div>
                {role === "student"
                  ? [["Branch", form.branch], ["Date of Admission", form.doa], ["Previous School", form.previousSchool]].map(([k, v]) => (
                    <div key={k} style={s.reviewRow}><span style={s.reviewKey}>{k}</span><span style={s.reviewVal}>{v || "-"}</span></div>
                  ))
                  : [["Department", form.department], ["Designation", form.designation]].map(([k, v]) => (
                    <div key={k} style={s.reviewRow}><span style={s.reviewKey}>{k}</span><span style={s.reviewVal}>{v || "-"}</span></div>
                  ))
                }
              </div>
              <div style={s.reviewCard}>
                <div style={s.reviewTitle}>Services</div>
                <div style={s.reviewRow}><span style={s.reviewKey}>Hostel</span><span style={s.reviewVal}>{hostelRequired ? `Yes — ${hostelPreference}` : "No"}</span></div>
                <div style={s.reviewRow}><span style={s.reviewKey}>Transport</span><span style={s.reviewVal}>{transportRequired ? `Yes — ${transportRoute}` : "No"}</span></div>
              </div>
              {role === "student" && (
                <div style={s.reviewCard}>
                  <div style={s.reviewTitle}>Parent Details</div>
                  {[["Name", form.parentName], ["Email", form.parentEmail], ["WhatsApp", form.parentPhone]].map(([k, v]) => (
                    <div key={k} style={s.reviewRow}><span style={s.reviewKey}>{k}</span><span style={s.reviewVal}>{v || "-"}</span></div>
                  ))}
                </div>
              )}
              <div style={s.reviewCard}>
                <div style={s.reviewTitle}>Payment</div>
                <div style={s.reviewRow}><span style={s.reviewKey}>Method</span><span style={s.reviewVal}>{payment.method?.toUpperCase()}</span></div>
                <div style={s.reviewRow}><span style={s.reviewKey}>Amount</span><span style={{ ...s.reviewVal, color: "#16a34a", fontWeight: "800" }}>₹{totalFee.toLocaleString()}</span></div>
                <div style={s.reviewRow}><span style={s.reviewKey}>Documents</span><span style={s.reviewVal}>{Object.keys(uploadedDocs).length} uploaded</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={s.navBtns}>
          {step > 0 && <button style={s.backStepBtn} onClick={() => { setStep((p) => p - 1); setError(""); }}>← Back</button>}
          {step < 4
            ? <button style={s.nextBtn} onClick={nextStep}>Next →</button>
            : <button style={s.submitBtn} onClick={submit} disabled={loading}>{loading ? "Submitting..." : "✓ Submit & Pay ₹" + totalFee.toLocaleString()}</button>
          }
        </div>

        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <span style={{ color: "#003566", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }} onClick={() => navigate("/")}>← Back to Home</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#003566 0%,#001d3d 100%)", padding: "32px 16px" },
  container: { maxWidth: "720px", margin: "0 auto", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  header: { textAlign: "center", marginBottom: "28px" },
  icon: { fontSize: "40px", color: "#003566", marginBottom: "8px" },
  title: { fontSize: "26px", fontWeight: "800", color: "#003566" },
  sub: { fontSize: "14px", color: "#666", marginTop: "4px" },
  stepper: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap", gap: "4px" },
  stepItem: { display: "flex", alignItems: "center" },
  stepCircle: (done, active) => ({ width: "32px", height: "32px", borderRadius: "50%", background: done ? "#003566" : "#e5e7eb", color: done ? "#ffc300" : "#999", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px", border: active ? "3px solid #ffc300" : "none", flexShrink: 0 }),
  stepLabel: (active) => ({ fontSize: "11px", fontWeight: active ? "700" : "500", color: active ? "#003566" : "#999", marginLeft: "4px", marginRight: "4px" }),
  stepLine: (done) => ({ width: "24px", height: "2px", background: done ? "#003566" : "#e5e7eb", margin: "0 2px" }),
  section: { marginBottom: "8px" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#003566", marginBottom: "12px", paddingBottom: "6px", borderBottom: "2px solid #ffc300", marginTop: "16px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  group: { marginBottom: "12px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "5px" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  select: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", background: "#fff" },
  roleBtn: (active) => ({ flex: 1, padding: "11px", borderRadius: "8px", border: `2px solid ${active ? "#003566" : "#ddd"}`, background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#555", fontWeight: "700", cursor: "pointer", fontSize: "14px" }),
  docRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "8px" },
  docName: { fontSize: "14px", color: "#333", fontWeight: "500" },
  uploadBtn: { padding: "6px 14px", borderRadius: "6px", border: "1px solid #003566", background: "#fff", color: "#003566", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  uploaded: { color: "#22c55e", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" },
  feeNote: { background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#92400e", marginTop: "8px" },
  serviceCard: (active) => ({ background: active ? "#fff7ed" : "#f8fafc", border: `2px solid ${active ? "#f97316" : "#e5e7eb"}`, borderRadius: "12px", padding: "16px", marginBottom: "12px", transition: "all 0.2s" }),
  serviceTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: "0 0 4px" },
  serviceDesc: { fontSize: "13px", color: "#6b7280", margin: "0 0 4px" },
  servicePrice: { fontSize: "13px", color: "#f97316", margin: 0 },
  yesBtn: (active) => ({ padding: "8px 18px", borderRadius: "8px", border: `2px solid ${active ? "#16a34a" : "#e5e7eb"}`, background: active ? "#16a34a" : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "700", cursor: "pointer", fontSize: "13px" }),
  noBtn: (active) => ({ padding: "8px 18px", borderRadius: "8px", border: `2px solid ${active ? "#dc2626" : "#e5e7eb"}`, background: active ? "#dc2626" : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "700", cursor: "pointer", fontSize: "13px" }),
  feeBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  feeTitle: { fontSize: "14px", fontWeight: "700", color: "#003566", marginBottom: "12px" },
  feeRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555", marginBottom: "8px" },
  feeDivider: { borderTop: "1px solid #e2e8f0", margin: "10px 0" },
  methodBtn: (active) => ({ padding: "10px 20px", borderRadius: "8px", border: `2px solid ${active ? "#003566" : "#ddd"}`, background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#555", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }),
  reviewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  reviewCard: { background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0" },
  reviewTitle: { fontSize: "13px", fontWeight: "700", color: "#003566", marginBottom: "10px", textTransform: "uppercase" },
  reviewRow: { display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" },
  reviewKey: { color: "#999", fontWeight: "500" },
  reviewVal: { color: "#333", fontWeight: "600", textAlign: "right", maxWidth: "60%" },
  navBtns: { display: "flex", gap: "12px", marginTop: "24px" },
  backStepBtn: { padding: "12px 24px", background: "#f3f4f6", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
  nextBtn: { flex: 1, padding: "12px", background: "#003566", color: "#ffc300", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  submitBtn: { flex: 1, padding: "12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  err: { color: "red", fontSize: "13px", marginBottom: "12px", textAlign: "center", background: "#fee2e2", padding: "8px", borderRadius: "8px" },
  success: { textAlign: "center", padding: "32px" },
  successIcon: { fontSize: "60px", color: "#22c55e", marginBottom: "16px" },
  successTitle: { fontSize: "22px", fontWeight: "800", color: "#003566", marginBottom: "8px" },
  successSub: { fontSize: "14px", color: "#666", marginBottom: "24px", lineHeight: "1.8" },
  backBtn: { padding: "10px 24px", background: "#003566", color: "#ffc300", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" },
};
