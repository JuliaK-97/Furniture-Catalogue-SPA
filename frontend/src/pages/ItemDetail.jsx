import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/itemDetail.css";
import "../styles/button.css";

export default function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [condition, setCondition] = useState("Good");
  const [damageTypes, setDamageTypes] = useState([]);
  const [area, setArea] = useState("");
  const [zone, setZone] = useState("");
  const [floor, setFloor] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [projectId, setProjectId] = useState("");
  const [showDamageOptions, setShowDamageOptions] = useState(false);

  const damageOptions = ["Scratches", "Broken leg", "Stained", "Torn fabric", "Water damage", "Missing part"];

useEffect(() => {
  const fetchItemData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${itemId}`);
      if (!res.ok) throw new Error("Not found in items");
      const data = await res.json();
      setItemName(data.name);
      setProjectId(data.projectId);
    } catch {
      try {
        const res = await fetch(`http://localhost:5000/api/itemCats/${itemId}`);
        if (!res.ok) throw new Error("Not found in itemCats");
        const data = await res.json();
        setItemName(data.name);
        setProjectId(data.projectId);
      } catch {
        setItemName("Unknown Item");
      }
    }
  };

  const fetchDetail = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/item-details/${itemId}`);
      if (!res.ok) return;
      const detail = await res.json();
      setCondition(detail.condition);
      setDamageTypes(detail.damageTypes || []);
      setArea(detail.location?.area || "");
      setZone(detail.location?.zone || "");
      setFloor(detail.location?.floor || "");
      setLotNumber(detail.lotNumber || "");
      setProjectId(detail.projectId || "");
    } catch {}
  };

  fetchItemData();
  fetchDetail();
}, [itemId]);


  const handleConditionChange = (value) => {
    setCondition(value);
    setShowDamageOptions(value !== "Good");
  };

  const handleDamageToggle = (type) => {
    setDamageTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCancel = () => {
    navigate(`/item_Cat/${projectId}/${itemId}`);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/item-details/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          projectId,
          condition,
          damageTypes,
          location: { area, zone, floor }
        })
      });
      const saved = await res.json();
      setLotNumber(saved.lotNumber);
      navigate(`/catalogue/${saved.projectId}`);
    } catch {
      alert("Error saving item detail");
    }
  };

  return (
    <div className="item-detail">
      <h2>Item Detail: {itemId}</h2>
      <label>
        Item Name:
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          disabled
        />
      </label>

      <fieldset>
        <legend>Condition:</legend>
        {["Good", "Fair", "Poor"].map((cond) => (
          <label key={cond}>
            <input
              type="radio"
              name="condition"
              value={cond}
              checked={condition === cond}
              onChange={() => handleConditionChange(cond)}
            />
            {cond}
          </label>
        ))}
      </fieldset>

      {showDamageOptions && (
        <fieldset>
          <legend>Damage (select all that apply):</legend>
          {damageOptions.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={damageTypes.includes(type)}
                onChange={() => handleDamageToggle(type)}
              />
              {type}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend>Location</legend>
        <label>
          Area:
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </label>
        <label>
          Zone:
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
        </label>
        <label>
          Floor:
          <input
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
        </label>
      </fieldset>

      <p><strong>Auto-generated Lot Number:</strong> {lotNumber ? lotNumber : "Pending"}</p>

      <div className="actions">
        <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-save" onClick={handleSubmit}>Submit</button>
        <button className="btn btn-dashboard" onClick={handleDashboard}>To Dashboard</button>
      </div>
    </div>
  );
}


