import { useState, useContext } from 'react';
import DJClientContext from '../providers/djclient';

export default function CreateCollectionCard() {
  const djClient = useContext(DJClientContext).DataJunctionAPI;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    djClient
      .createCollection(name, description)
      .then(response => {
        if (response.status >= 300) {
          alert('An error occurred while trying to create the collection.');
        }
        return response.json();
      })
      .then(data => {
        window.location.href = `/?collection=${data.id}`;
      })
      .catch(error => {
        console.error('Error creating collection:', error);
        alert('An error occurred while trying to create the collection.');
      });
  };

  return (
    <article className="information [ card ]">
      <span className="collection_badge badge tag">
        Create a New Collection
      </span>
      <form>
        <div className="DescriptionInput">
          <label>Name</label>
          <input
            type="text"
            placeholder="Collection Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="DescriptionInput">
          <label>Description</label>
          <textarea
            placeholder="Collection Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="DisplayNameInput"
          />
        </div>
      </form>
      <div>
        <button className="menu-button" onClick={handleCreate}>
          Create
        </button>
      </div>
    </article>
  );
}
