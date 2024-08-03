import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import CollectionCard from '../../components/CollectionCard';
import DJClientContext from '../../providers/djclient';
import 'styles/node-list.css';

export function CollectionsPage() {
  const djClient = useContext(DJClientContext).DataJunctionAPI;
  var { collection } = useParams();

  const [state, setState] = useState({
    collection: collection,
    nodes: [],
  });

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const collections = await djClient.collections();
      setCollections(collections);
    };
    fetchData().catch(console.error);
  }, [djClient, djClient.collections]);

  return (
    <div className="mid">
      <div className="card-header">
        <span className="menu-link">
          <span className="menu-title">
            <a href="/collections/create">
              <span className="add_node">+ Create Collection</span>
            </a>
          </span>
        </span>
        <div className="">
          <div className={`sidebar`}>
            <p></p>
          </div>
          <div className="cards">
            {collections.map(c => <CollectionCard name={c.name} description={c.description} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
