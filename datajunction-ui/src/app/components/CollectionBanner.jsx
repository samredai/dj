function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export default function CollectionBanner({ name, description, numNodes }) {
  const numNodesDescription = `${numNodes} ${pluralize(numNodes, "node", "nodes")}`
  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <h2>{name}</h2>
          <span className="header-badge">{numNodesDescription}</span>
        </div>
        <div>{description}</div>
      </div>
    </div>
  );
}
