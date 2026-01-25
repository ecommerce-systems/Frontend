import React, { useState } from "react";
import axiosInstance from "../../api";

function CoPurchaseList() {
  const [productId, setProductId] = useState("");
  const [coPurchases, setCoPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCoPurchases = async () => {
    if (!productId) {
      setError("Please enter a Product ID.");
      return;
    }
    setLoading(true);
    setError("");
    setCoPurchases([]);
    try {
      const response = await axiosInstance.get(
        `/api/v2/co-purchase/${productId}`,
      );
      setCoPurchases(response.data);
    } catch (err) {
      setError(`Failed to fetch co-purchased products for ID ${productId}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Co-purchased Products (V2)</h3>
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Enter Product ID"
      />
      <button onClick={fetchCoPurchases}>Get Co-purchased</button>

      {loading && <p>Loading co-purchased products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="product-list">
        {coPurchases.map((product) => (
          <div key={product.productId} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.prodName}
              style={{ width: "100%" }}
            />
            <h4>{product.prodName}</h4>
            <p>{product.detailDesc}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoPurchaseList;
