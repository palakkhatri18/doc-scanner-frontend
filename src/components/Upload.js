import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const CLOUD_NAME = "dsby4idm9";
const UPLOAD_PRESET = "doc_scanner_uploads";

function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PNG, JPG, or PDF files are allowed");
      return;
    }

    setError("");
    setSuccess("");
    setScannedImage(null);
    setFile(selectedFile);

    if (selectedFile.type !== "application/pdf") {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data);

      const originalUrl = data.secure_url || data.url;
      if (!originalUrl) {
        throw new Error("Cloudinary upload failed");
      }

      // 2️⃣ Send image URL to FastAPI for scanning
      const scanRes = await fetch("http://127.0.0.1:8000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: originalUrl,
        }),
      });

      const scanData = await scanRes.json();
      console.log("Scan response:", scanData);

      if (!scanData.output_url) {
        throw new Error("Scanning failed");
      }

      setScannedImage(scanData.output_url);

      // 3️⃣ Save metadata in Firestore
      await addDoc(collection(db, "uploads"), {
        userId: user.uid,
        fileName: file.name,
        fileType: file.type,
        originalUrl,
        scannedUrl: scanData.output_url,
        status: "scanned",
        createdAt: serverTimestamp(),
      });

      setSuccess("File uploaded & scanned successfully!");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Upload Document</h2>

      <input type="file" onChange={handleFileChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {file && (
        <div style={{ marginTop: 10 }}>
          <p><b>File name:</b> {file.name}</p>
          <p><b>File type:</b> {file.type}</p>
        </div>
      )}

      {preview && (
        <div style={{ marginTop: 10 }}>
          <h4>Original Preview</h4>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}

      {file && (
        <div style={{ marginTop: 10 }}>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading & Scanning..." : "Upload"}
          </button>
        </div>
      )}

      {scannedImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Scanned Document</h3>
          <img
            src={scannedImage}
            alt="scanned"
            style={{ maxWidth: "300px", border: "2px solid black" }}
          />
          <br />
          <a href={scannedImage} target="_blank" rel="noreferrer">
            Open full scanned image
          </a>
        </div>
      )}
    </div>
  );
}

export default Upload;
