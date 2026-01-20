import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UrlShortener.css";

const API_BASE = "http://localhost:8000";

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/urls`);
      console.log("Fetched URLs:", res.data);
      setUrls(res.data);
    } catch (err) {
      console.error("Error fetching URLs:", err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE}/shorten`, { original_url: originalUrl });
      setMessage("URL shortened successfully!");
      setMessageType("success");
      setOriginalUrl("");
      fetchUrls();
    } catch (err) {
      console.error(err);
      setMessage("Error shortening URL!");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage("Copied to clipboard!");
    setMessageType("success");
    setTimeout(() => setMessage(""), 2000);
  };

  const deleteUrl = async (shortCode) => {
    if (!shortCode) {
      setMessage("Cannot delete: Short code is missing!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      await axios.delete(`${API_BASE}/delete/${shortCode}`);

      setUrls((prevUrls) =>
        prevUrls.filter((url) => url.short_code !== shortCode),
      );

      setMessage("URL deleted successfully!");
      setMessageType("success");

      await fetchUrls();

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete URL!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="url-shortener-wrapper">
      <div className="url-shortener-container">
        <h1 className="main-heading">FastAPI URL Shortener</h1>

        <div className="content-card">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="url-input-form">
            <input
              type="url"
              className="url-input"
              placeholder="Enter a long URL..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <button className="shorten-button" type="submit" disabled={loading}>
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {/* Message Alert */}
          {message && (
            <div className={`message-box ${messageType}`}>{message}</div>
          )}

          {/* Table */}
          <table className="urls-table">
            <thead>
              <tr>
                <th className="col-number">#</th>
                <th className="col-original">Original URL</th>
                <th className="col-short">Short URL</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, index) => (
                <tr key={url.id}>
                  <td className="cell-number">{index + 1}</td>
                  <td className="cell-original">
                    <a
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="original-link"
                    >
                      {url.original_url}
                    </a>
                  </td>
                  <td className="cell-short">
                    <a
                      href={url.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-link"
                    >
                      {url.short_url}
                    </a>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-button copy-button"
                      onClick={() => copyToClipboard(url.short_url)}
                    >
                      Copy
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => deleteUrl(url.short_code)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {urls.length === 0 && (
            <div className="empty-state">
              No URLs yet. Shorten your first URL above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UrlShortener;
