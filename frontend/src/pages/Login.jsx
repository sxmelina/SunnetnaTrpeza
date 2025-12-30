export default function Login() {
  return (
    <div style={styles.card}>
      <h2 style={styles.h2}>Prijava</h2>

      <label style={styles.label}>Email</label>
      <input style={styles.input} placeholder="npr. amina@mail.com" />

      <label style={styles.label}>Lozinka</label>
      <input style={styles.input} type="password" placeholder="••••••••" />

      <button style={styles.btn}>Prijavi se</button>

      <p style={styles.small}>(sad je samo UI – poslije spajamo na backend)</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 16,
    padding: 20,
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  h2: { marginTop: 0 },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontSize: 14 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
  },
  btn: {
    width: "100%",
    marginTop: 16,
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#e7d2b5",
    cursor: "pointer",
    fontWeight: 600,
  },
  small: { marginTop: 10, fontSize: 12, color: "#666" },
};
