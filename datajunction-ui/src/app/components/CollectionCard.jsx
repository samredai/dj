import { useContext } from 'react';
import DJClientContext from '../providers/djclient';

export default function CollectionCard({ collectionId, name, description }) {
  const djClient = useContext(DJClientContext).DataJunctionAPI;
  const handleNavigation = () => {
    window.location.href = `/?collection=${collectionId}`;
  };
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete collection ${name}? This action cannot be undone.`,
    );
    if (confirmDelete) {
      djClient
        .deleteCollection(collectionId)
        .then(response => {
          alert('Collection successfully deleted.');
          window.location.reload(); // Reload the page or navigate to another page
        })
        .catch(error => {
          // Handle errors, e.g., show an error message
          console.error('Error deleting collection:', error);
          alert('An error occurred while trying to delete the collection.');
        });
    }
  };
  return (
    <article className="information [ card ]">
      <span className="collection_badge badge tag">Collection</span>
      <h2 className="title">{name}</h2>
      <p className="info">{description}</p>
      <div>
        <button className="menu-button" onClick={handleNavigation}>
          Explore
        </button>
        <button className="menu-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
