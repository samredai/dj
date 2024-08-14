
export default function RemoveIcon({ nodeName, collectionId, onRemove, djClient }) {
    const handleClick = () => {
      djClient.removeNodeFromCollection(nodeName, collectionId)
        .then(response => {
          // Handle successful response
          if (onRemove) {
            onRemove(response);
          }
        })
        .catch(error => {
          // Handle error
          console.error(`Error removing node from collection ${collectionId}:`, error);
        });
    };
  
    return (
      <svg
        className="feather feather-minus-square"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
        style={{ cursor: 'pointer' }} // Optional: change cursor to pointer to indicate it's clickable
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="8" x2="16" y1="12" y2="12" />
      </svg>
    );
  }