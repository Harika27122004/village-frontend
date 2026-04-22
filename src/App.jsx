import { useEffect, useState } from "react";

const BASE_URL = "https://village-api-q468.onrender.com";

function App() {
  const [villages, setVillages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH DATA (ONLY WHEN NEEDED)
  const fetchVillages = async (p = 1) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/villages?page=${p}&limit=20`
      );
      const data = await res.json();

      console.log("API DATA:", data);

      if (data && Array.isArray(data.data)) {
        setVillages(data.data);
        setPage(p);
      } else {
        setVillages([]);
      }
    } catch (err) {
      console.error(err);
      setVillages([]);
    }

    setLoading(false);
  };

  // ✅ SEARCH (NO RESET BUG)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      fetchVillages(1);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/villages/search?name=${value}`
      );
      const data = await res.json();

      console.log("SEARCH DATA:", data);

      if (Array.isArray(data)) {
        setVillages(data);
      } else {
        setVillages([]);
      }
    } catch (err) {
      console.error(err);
      setVillages([]);
    }

    setLoading(false);
  };

  // ✅ ONLY RUN ONCE
  useEffect(() => {
    fetchVillages(1);
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Village Finder 🚀</h1>

      {/* Search */}
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

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* No Data */}
      {!loading && villages.length === 0 && (
        <p style={{ textAlign: "center" }}>No villages found</p>
      )}

      {/* Table */}
      {!loading && villages.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#333", color: "#fff" }}>
              <th style={{ padding: "10px" }}>Code</th>
              <th style={{ padding: "10px" }}>Village Name</th>
              <th style={{ padding: "10px" }}>Subdistrict</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v, index) => (
              <tr key={v.village_code || index}>
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
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => fetchVillages(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button onClick={() => fetchVillages(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;