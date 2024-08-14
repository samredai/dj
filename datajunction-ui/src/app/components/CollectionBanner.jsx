import { useContext, useState, useEffect } from 'react';
import DJClientContext from '../providers/djclient';

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export default function CollectionBanner({ collectionId, name, description, numNodes, setNumNodes }) {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');
  const [buttonText, setButtonText] = useState('Add');
  const djClient = useContext(DJClientContext).DataJunctionAPI;

  useEffect(() => {
    async function fetchNodes() {
      const nodesList = await djClient.nodes();
      setNodes(nodesList);
    }

    fetchNodes();
  }, []);

  const handleAddClick = async () => {
    if (!selectedNode) return;
    try {
      await djClient.addNodeToCollection(selectedNode, collectionId);
      setButtonText(`Added node ${selectedNode}!`);
      setNumNodes(numNodes + 1);
      setTimeout(() => setButtonText('Add'), 2000); // Reset button text after 2 seconds
    } catch (error) {
      console.error('Failed to add node to collection:', error);
    }
  };
  const numNodesDescription = `${numNodes} ${pluralize(
    numNodes,
    'node',
    'nodes',
  )}`;
  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <h2>{name}</h2>
          <span className="header-badge">ID: {collectionId}</span><span className="header-badge">{numNodesDescription}</span>
        </div>
        <div></div>
        <div>{description}</div>
        <h3>Add Nodes to this Collection</h3>
        <form>
        <select className="SelectInput" value={selectedNode} onChange={(e) => setSelectedNode(e.target.value)}>
          <option value="" disabled>Select a node</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
        <button className="add_button" type="button" onClick={handleAddClick} disabled={!selectedNode}>
          {buttonText}
        </button>
        </form>

      </div>
    </div>
  );
}
