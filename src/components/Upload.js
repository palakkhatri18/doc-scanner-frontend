import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Upload.css";

const CLOUD_NAME = "dsby4idm9";
const UPLOAD_PRESET = "doc_scanner_uploads";

function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setScannedImage(null);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      const originalUrl = data.secure_url;

      // Send to backend
      const scanRes = await fetch(
        "https://doc-scanner-backend-ku8a.onrender.com/process",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: originalUrl }),
        }
      );

      const scanData = await scanRes.json();
      setScannedImage(scanData.output_url);

      await addDoc(collection(db, "uploads"), {
        userId: user.uid,
        originalUrl,
        scannedUrl: scanData.output_url,
        createdAt: serverTimestamp(),
      });

      setSuccess("File uploaded & scanned successfully!");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <h2>Document Scanner</h2>

      <input type="file" onChange={handleFileChange} />

      {preview && (
        <div className="upload-preview">
          <img src={preview} alt="preview" />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Scanning..." : "Upload & Scan"}
      </button>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      {scannedImage && (
        <div className="upload-preview">
          <h3>Scanned Document</h3>
          <img src={scannedImage} alt="scanned" />
          <a href={scannedImage} target="_blank" rel="noreferrer">
            Open full scanned image
          </a>
        </div>
      )}
    </div>
  );
}

export default Upload;
