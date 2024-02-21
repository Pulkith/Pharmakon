import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
function Dashboard() {
  const [data, setData] = useState([]);
  const [showdata, setShowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnsToDrop, setColumnsToDrop] = useState(["comments", "microevent_id"]);
  const [microSpecimenValue, setMicroSpecimenValue] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Fetch data from CSV file on component mount
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("./data.csv");
      const csvData = await response.text();
      const results = Papa.parse(csvData, { header: true });
      const filteredData = results.data.map((item) => {
        const filteredItem = { ...item };
        columnsToDrop.forEach((column) => {
          delete filteredItem[column];
        });
        return filteredItem;
      });
      setData(filteredData);
      setShowData(filteredData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    };
    fetchData();
  }, [columnsToDrop]);

  // Handle pagination changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setMicroSpecimenValue(event.target.value);
  };

  const handleSubmit = () => {
    if (microSpecimenValue !== "") {
      const filteredData = showdata.filter((item) =>
        (item.micro_specimen_id && item.micro_specimen_id.toString().includes(microSpecimenValue))
      );
      setShowData(filteredData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setCurrentPage(1);
    } else {
      setShowData(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    }
  };

  return (
    <div className="container" style={{width:"100%", marginLeft:"5%"}}>
      <div>
        <button onClick={() => { window.location.href = "/Dashboard"; }}>
          <span style={{ width: "50px" }}></span>
        </button>
      </div>
      <h1 style={{ textAlign: "center" }}>
        <div className="header textwhite fw900 fs350 gradtext centerchild">Database</div>
      </h1>
      <div style={{ marginTop: "50px", justifyContent:"center", textAlign:"center"}}>
        <div>
            <input
                type="text"
                placeholder="Filter by micro_specimen_id"
                value={microSpecimenValue}
                onChange={handleFilterChange}
                style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    width: "100%",
                    marginBottom: "10px",
                }}
            />
        </div>
        <div>
            <button onClick={handleSubmit} style={{ marginTop: "10px", width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", borderRadius: "5px", border: "none" }}>
                <h1>
                    Submit
                </h1>
            </button>
        </div>
      </div>
      <div style={{ marginTop: "20px", overflowX:"scroll"}}>
        <table style={{ width: "100%", overflowX:"scroll" }}>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((header) => (
                  <th key={header} style={{ border: "1px solid #ddd", backgroundColor: "#212529", color: "white", padding: "8px" }}>
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {showdata
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, index) => (
                    <td key={index} style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: "inline-block", justifyContent: "center", marginTop: "20px", overflowX: "scroll", width:"100%" }}>
            <div style={{ display: "flex", overflowX:"scroll" }}>
            {[...Array(totalPages).keys()].map((pageNumber) => (
                <button
                key={pageNumber + 1}
                style={{ backgroundColor: currentPage === pageNumber + 1 ? "#007bff" : "black", color: currentPage === pageNumber + 1 ? "white" : "white", padding: "8px 16px", cursor: "pointer", border: "1px solid #ccc" }}
                onClick={() => handlePageChange(pageNumber + 1)}
                >
                {pageNumber + 1}
                </button>
            ))}
            </div>
        </div>
        )}
    </div>
  );
}

export default Dashboard;