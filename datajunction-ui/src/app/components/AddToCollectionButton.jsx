import { useContext, useState, useEffect } from 'react';
import DJClientContext from '../providers/djclient';

export default function AddToCollectionButton({ nodeName }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const djClient = useContext(DJClientContext).DataJunctionAPI;

  useEffect(() => {
    if (isDropdownVisible && collections.length === 0) {
      djClient
        .collections()
        .then(data => {
          setCollections(data);
        })
        .catch(error => {
          console.error('Error fetching collections:', error);
        });
    }
  }, [isDropdownVisible, collections]);

  const handleButtonClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleAddClick = () => {
    if (selectedItem) {
      djClient
        .addNodeToCollection(nodeName, selectedItem)
        .then(() => setDropdownVisible(false))
        .catch(error => {
          console.error('Error fetching collections:', error);
        });
    }
  };
  return (
    <div className="badge">
      {!isDropdownVisible && (
        <button className="menu-button" onClick={handleButtonClick}>+ Collection</button>
      )}
      {isDropdownVisible && (
        <div>
          <select onChange={e => setSelectedItem(e.target.value)}>
            <option value="">Select an item</option>
            {collections.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddClick}>Add</button>
        </div>
      )}
    </div>
  );
}
