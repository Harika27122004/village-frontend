import { useEffect, useState } from "react";

const BASE_URL = "https://village-api.onrender.com"; // 🔥 CHANGE ONLY THIS if needed

function App() {
  const [villages, setVillages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Fetch villages (pagination)
  const fetchVillages = async (p = 1) => {
    if (p < 1) return;

    setLoading(true);
    setPage(p);

    try {
      const res = await fetch(
        `${BASE_URL}/villages?page=${p}&limit=20`
      );
      const data = await res.json();
      setVillages(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setVillages([]);
    }

    setLoading(false);
  };

  // ✅ Search villages
  const handleSearch = async (e) => {
    const value = e.target.value.trim();
    setSearch(value);

    // Empty → go back to pagination
    if (value === "") {
      setIsSearching(false);
      fetchVillages(1);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/villages/search?name=${value}`
      );
      const data = await res.json();
      setVillages(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setVillages([]);
    }

    setLoading(false);
  };

  // ✅ Initial load
  useEffect(() => {
    fetchVillages(1);
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Village Finder 🚀</h1>

      {/* 🔍 Search */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          placeholder="Search villages..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />
      </div>

      {/* Search Info */}
      {isSearching && (
        <p style={{ textAlign: "center" }}>
          Showing results for "{search}"
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center" }}>Loading...</p>
      )}

      {/* No Data */}
      {!loading && villages.length === 0 && (
        <p style={{ textAlign: "center" }}>No villages found</p>
      )}

      {/* Table */}
      {!loading && villages.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#333", color: "#fff" }}>
              <th style={{ padding: "10px" }}>Code</th>
              <th style={{ padding: "10px" }}>Village Name</th>
              <th style={{ padding: "10px" }}>Subdistrict</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v) => (
              <tr key={v.village_code}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  {v.village_code}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  {v.village_name}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  {v.subdistrict_code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {!isSearching && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => fetchVillages(page - 1)}
            disabled={page === 1}
            style={{ marginRight: "10px", padding: "8px" }}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>Page {page}</span>

          <button
            onClick={() => fetchVillages(page + 1)}
            style={{ marginLeft: "10px", padding: "8px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;