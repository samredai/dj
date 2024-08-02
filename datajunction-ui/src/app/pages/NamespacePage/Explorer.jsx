import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollapsedIcon from '../../icons/CollapsedIcon';
import ExpandedIcon from '../../icons/ExpandedIcon';

const renderNamespaceUrl = (namespace, collection) => {
  let url = `/namespaces/${namespace}`;
  console.log(collection)
  if (collection) {
    url += `?collection=${encodeURIComponent(collection)}`;
  }
  return url;
};

const Explorer = ({ item = [], current, collection }) => {
  const [items, setItems] = useState([]);
  const [expand, setExpand] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [searchParams] = useSearchParams();
  const collection = searchParams.get('collection');

  useEffect(() => {
    setItems(item);
    setHighlight(current);
    if (current === undefined || current?.startsWith(item.path)) {
      setExpand(true);
    } else setExpand(false);
  }, [current, item]);

  const handleClickOnParent = e => {
    e.stopPropagation();
    setExpand(prev => {
      return !prev;
    });
  };

  return (
    <>
      <div
        className={`select-name ${
          highlight === items.path ? 'select-name-highlight' : ''
        }`}
        onClick={handleClickOnParent}
      >
        {items.children && items.children.length > 0 ? (
          <span>{!expand ? <CollapsedIcon /> : <ExpandedIcon />} </span>
        ) : null}
        <a href={renderNamespaceUrl(items.path, collection)}>{items.namespace}</a>{' '}
      </div>
      {items.children
        ? items.children.map((item, index) => (
            <div
              style={{
                paddingLeft: '1.4rem',
                marginLeft: '1rem',
                borderLeft: '1px solid rgb(218 233 255)',
              }}
            >
              <div className={`${expand ? '' : 'inactive'}`}>
                <Explorer item={item} current={highlight} />
              </div>
            </div>
          ))
        : null}
    </>
  );
};

export default Explorer;
