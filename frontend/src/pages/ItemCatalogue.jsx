import { useParams } from "react-router-dom";

export default function ItemCatalogue() {
  const { categoryId } = useParams();

  return (
    <div className="item-catalogue">
      <h2>Item Catalogue</h2>
      <p>You selected category: <strong>{categoryId}</strong></p>

      <p>
        This is a temporary placeholder page. Later, you’ll replace this with
        the actual catalogue view showing items in the <em>{categoryId}</em> category.
      </p>
    </div>
  );

}
