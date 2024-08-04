import { useContext, useState, useEffect } from 'react';
import DJClientContext from '../providers/djclient';

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export default function CollectionBanner({ name, description, numNodes, setNumNodes }) {
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
      await djClient.addNodeToCollection(selectedNode, name);
      setButtonText('Added!');
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
          <span className="header-badge">{numNodesDescription}</span>
        </div>
        <div>{description}</div>
      </div>
      <div className="card-body">
        <select value={selectedNode} onChange={(e) => setSelectedNode(e.target.value)}>
          <option value="" disabled>Select a node</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
        <button onClick={handleAddClick} disabled={!selectedNode}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
