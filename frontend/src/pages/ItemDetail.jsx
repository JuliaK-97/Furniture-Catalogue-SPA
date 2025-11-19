import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/itemDetail.css";
import "../styles/button.css";
/**
 * @component ItemDetail
 * @description
 * Displays the detailed view for a single item, allowing users to:
 *  - View basic item information (name, project)
 *  - Edit condition and select applicable damage types
 *  - Edit item location (area, zone, floor)
 *  - Submit updates to the backend or cancel edits
 *  - Navigate back to the dashboard or project catalogue
 * Fetches item data and item details from the backend API on mount, and handles
 * both existing items and fallback cases when data is missing.
 * @returns {JSX.Element} The rendered item detail component.
 */
export default function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [itemName, setItemName] = useState("");
  const [condition, setCondition] = useState("Good");
  const [damageTypes, setDamageTypes] = useState([]);
  const [area, setArea] = useState("");
  const [zone, setZone] = useState("");
  const [floor, setFloor] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [projectId, setProjectId] = useState("");
  const [showDamageOptions, setShowDamageOptions] = useState(false);
//predefined damage options for items
  const damageOptions = ["Scratches", "Broken leg", "Stained", "Torn fabric", "Water damage", "Missing part"];
  /**
   * @function fetchItemData
   * @description
   * Fetches the main item data from the `/items` endpoint.
   * If item is not found, falls back to `/itemCats`.
   * Sets `itemName` and `projectId` for rendering and navigation.
   * Provides robustness in case item exists only in alternate endpoint.
   * @returns {Promise<void>}
   */
useEffect(() => {
  const fetchItemData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/${itemId}`);
      if (!res.ok) throw new Error("Not found in items");
      const data = await res.json();
      setItemName(data.name);
      setProjectId(data.projectId);
    } catch {
      try {
        const res = await fetch(`${API_BASE_URL}/itemCats/${itemId}`);
        if (!res.ok) throw new Error("Not found in itemCats");
        const data = await res.json();
        setItemName(data.name);
        setProjectId(data.projectId);
      } catch {
        setItemName("Unknown Item");
      }
    }
  };
  /**
   * @function fetchDetail
   * @description
   * Fetches detailed information for the item, including condition, damage, location, lot number, and associated project. 
   * This populates editable fields.
   */
  const fetchDetail = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/item-details/${itemId}`);
      if (!res.ok) return;// silently fail if no detail exists
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
}, [itemId, API_BASE_URL]);

  /**
   * @function handleConditionChange
   * @description
   * Updates `condition` state and shows/hides damage options based on whether the condition is "Good".
   * @param {String} value - The selected condition ("Good", "Fair", "Poor")
   * @returns {void}
   */
  const handleConditionChange = (value) => {
    setCondition(value);
    setShowDamageOptions(value !== "Good");
  };
  /**
   * @function handleDamageToggle
   * @description
   * Adds or removes a damage type from `damageTypes` state.
   * Allows multiple damage types to be selected.
   * @param {String} type - Damage type to toggle
   * @returns {void}
   */
  const handleDamageToggle = (type) => {
    setDamageTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  /**
   * @function handleCancel
   * @description
   * Navigates back to the item category page without saving changes.
   * Uses `projectId` and `itemId` for proper routing.
   * @returns {void}
   */
  const handleCancel = () => {
    navigate(`/item_Cat/${projectId}/${itemId}`);
  };
  /**
   * @function handleDashboard
   * @description
   * Navigates the user back to the dashboard page.
   * @returns {void}
   */
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  /**
   * @function handleSubmit
   * @description
   * Sends a PUT request to update item details on the backend.
   * Updates local state with returned `lotNumber` and navigates back to catalogue.
   * Alerts the user in case of error.
   * extra Notes:
   * - Sends all editable fields including condition, damage, and location.
   * - Ensures UI reflects backend updates immediately.
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/item-details/${itemId}`, {
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


