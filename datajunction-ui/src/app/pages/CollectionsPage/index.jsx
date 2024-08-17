import { useContext, useEffect, useState } from 'react';
import CollectionCard from '../../components/CollectionCard';
import CreateCollectionCard from '../../components/CreateCollectionCard';
import DJClientContext from '../../providers/djclient';
import 'styles/node-list.css';
import DJLogo from 'app/icons/DJLogo';

export function CollectionsPage() {
  const djClient = useContext(DJClientContext).DataJunctionAPI;
  const [collections, setCollections] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const collections = await djClient.collections();
      setCollections(collections);
    };
    fetchData().catch(console.error);
  }, [djClient, djClient.collections]);

  const displayCreateCollection = () => {
    setShowCreateCollection(!showCreateCollection);
  };
  const CreateCollectionButton = (
    <button className="menu-button" onClick={displayCreateCollection}>
      + Create Collection
    </button>
  );
  return (
    <div className="mid">
      <div className="card-header">
        <span className="menu-link">
          <span className="menu-title">{CreateCollectionButton}</span>
        </span>
        <div className="">
          <div className={`sidebar`}>
            <p></p>
          </div>
          <div className="cards">
            {showCreateCollection ? <CreateCollectionCard /> : <></>}
            {collections.map(c => (
              <CollectionCard
                collectionId={c.id}
                name={c.name}
                description={c.description}
              />
            ))}
            {!showCreateCollection && !collections.length && (
              <div>
                <h1>
                  <DJLogo /> No collections yet!
                </h1>
                <p>
                  It looks like you haven't created any collections. Click the
                  button below to get started and organize your nodes.
                </p>
                {CreateCollectionButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
