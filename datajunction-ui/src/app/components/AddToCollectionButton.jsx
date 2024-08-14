import { useContext, useState, useEffect } from 'react';
import DJClientContext from '../providers/djclient';
import { displayMessageAfterSubmit } from '../../utils/form';

export default function AddToCollectionButton({ nodeName }) {
  const [status, setStatus] = useState();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showAddButton, setShowAddButton] = useState(true);
  const [selectedCollectionID, setSelectedCollectionID] = useState(null);
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
    if (selectedCollectionID) {
      djClient
        .addNodeToCollection(nodeName, selectedCollectionID)
        .then(() => {
          setShowAddButton(false);
          setDropdownVisible(false);
          setStatus({
            success: (
              <>
                Node successfully added to {' '}
                <a href={`/?collection=${selectedCollectionID}`}>Collection {selectedCollectionID}</a>
              </>
            ),
          });
          setTimeout(() => {
            setStatus(null);
            setShowAddButton(true);
          }, 2000); // Reset button text after 2 seconds
        })
        .catch(error => {
          console.error('Error fetching collections:', error);
        });
    }
  };
  return (
    <div className="badge">
      {!isDropdownVisible && showAddButton ? (
        <button className="menu-button" onClick={handleButtonClick}>
          + Collection
        </button>
      ) : (
        <></>
      )}
      {isDropdownVisible && (
        <form>
          <select onChange={e => setSelectedCollectionID(e.target.value)}>
            <option value="">Select an item</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="add_button" type="button" onClick={handleAddClick}>
            Add
          </button>
        </form>
      )}
      {displayMessageAfterSubmit(status)}
    </div>
  );
}
