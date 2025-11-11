import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/itemDetail.css";


export default function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [itemName, setItemName]=useState("");
  const [condition, setCondition]=useState("");
  const [showDamageOptions, setShowDamageOptions]=useState(false);
  const [damageTypes, setDamageTypes]=useState([]);
  const [lotNumber, setLotNumber]=useState("");
  const [area, setArea]=useState("");
  const [zone, setZone]=useState("");
  const [floor, setFloor]=useState("");

  const damageOptions = ["Scratches", "Broken leg", "Stains", "Cracks"];

  useEffect(() => {
    const mockItem = {
      id: itemId,
      name:"White desk"
    };
    setItemName(mockItem.name);
    const timestamp = Date.now().toString().slice(-6);
    setLotNumber(`LOT-${itemId}-${timestamp}`);
  }, {itemId});

  const handleConditionChange = (value) => {
    setCondition(value);
    setShowDamageOptions(value ==="Fair" || value ==="Poor");
    if (value==="Good") setDamageTypes([]);
  };
  const handleDamageToggle = (type) => {
    setDamageTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };
   
   const handleCancel = () => {
    navigate(`/item_Cat/${itemId}`);
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleSubmit = () => {
    const itemData = {
      id: itemId,
      name: itemName,
      condition,
      damageTypes,
      lotNumber,
      location: {
        area,
        zone,
        floor,
      },
    };
    console.log("Saving item:", itemData);
    navigate(`/catalogue/project-001`);
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

      <p><strong>Auto-generated Lot Number:</strong> {lotNumber}</p>

      <div className="actions">
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Submit
        </button>
        <button className="btn-dashboard" onClick={handleDashboard}>To Dashboard</button>
      </div>
    </div>
  );

}
