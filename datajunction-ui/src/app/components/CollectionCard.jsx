export default function CollectionCard({ name, description }) {
  return (
    <article className="information [ card ]">
      <span className="collection_badge badge tag">Collection</span>
      <h2 className="title">{name}</h2>
      <p className="info">
        {description}
      </p>
      <a href={`/?collection=${name}`}>
        View Nodes
      </a>
    </article>
  );
}
