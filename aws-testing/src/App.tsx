import { useEffect, useState } from 'react';
import './App.css';

interface IData {
  id: number;
  name: string;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };
  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const [localStorageData, setLocalStorageData] = useState<IData[]>([]);
  const [sessionStorageData, setSessionStorageData] = useState<IData[]>([]);
  const [indexedDBData, setIndexedDBData] = useState<IData[]>([]);
  const [cookieData, setCookieData] = useState<IData[]>([]);
  const [cacheStorageData, setCacheStorageData] = useState<IData | null>(null);

  // Create dummy data
  const dummyData: IData[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Doe' },
  ];

  // Local Storage
  useEffect(() => {
    const storedData = localStorage.getItem('localStorageData');
    if (storedData) {
      setLocalStorageData(JSON.parse(storedData));
    } else {
      localStorage.setItem('localStorageData', JSON.stringify(dummyData));
      setLocalStorageData(dummyData);
    }
  }, []);

  const addToLocalStorage = () => {
    const newData: IData = { id: localStorageData.length + 1, name: 'New Name' };
    const updatedData = [...localStorageData, newData];
    localStorage.setItem('localStorageData', JSON.stringify(updatedData));
    setLocalStorageData(updatedData);
  };

  const removeFromLocalStorage = (id: number) => {
    const updatedData = localStorageData.filter((item) => item.id !== id);
    localStorage.setItem('localStorageData', JSON.stringify(updatedData));
    setLocalStorageData(updatedData);
  };

  // Session Storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('sessionStorageData');
    if (storedData) {
      setSessionStorageData(JSON.parse(storedData));
    } else {
      sessionStorage.setItem('sessionStorageData', JSON.stringify(dummyData));
      setSessionStorageData(dummyData);
    }
  }, []);

  const addToSessionStorage = () => {
    const newData: IData = { id: sessionStorageData.length + 1, name: 'New Name' };
    const updatedData = [...sessionStorageData, newData];
    sessionStorage.setItem('sessionStorageData', JSON.stringify(updatedData));
    setSessionStorageData(updatedData);
  };

  const removeFromSessionStorage = (id: number) => {
    const updatedData = sessionStorageData.filter((item) => item.id !== id);
    sessionStorage.setItem('sessionStorageData', JSON.stringify(updatedData));
    setSessionStorageData(updatedData);
  };

  // IndexedDB
  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open('example_db', 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const objectStore = db.createObjectStore('data', { keyPath: 'id' });
        objectStore.transaction.oncomplete = () => {
          const dataStore = db.transaction('data', 'readwrite').objectStore('data');
          dummyData.forEach((item) => {
            dataStore.add(item);
          });
        };
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction('data', 'readonly');
        const objectStore = transaction.objectStore('data');
        const getRequest = objectStore.getAll();
        getRequest.onsuccess = (event) => {
          setIndexedDBData((event.target as IDBRequest<IDBValidKey[]>).result);
        };
      };
    };

    openDB();
  }, []);

  const addToIndexedDB = () => {
    const newData: IData = { id: indexedDBData.length + 1, name: 'New Name' };

    const request = indexedDB.open('example_db', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('data', 'readwrite');
      const objectStore = transaction.objectStore('data');
      const addRequest = objectStore.add(newData);
      addRequest.onsuccess = () => {
        setIndexedDBData([...indexedDBData, newData]);
      };
    };
  };

  const removeFromIndexedDB = (id: number) => {
    const request = indexedDB.open('example_db', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('data', 'readwrite');
      const objectStore = transaction.objectStore('data');
      const deleteRequest = objectStore.delete(id);
      deleteRequest.onsuccess = () => {
        const updatedData = indexedDBData.filter((item) => item.id !== id);
        setIndexedDBData(updatedData);
      };
    };
  };

  // Cookies
  useEffect(() => {
    const cookieString = decodeURIComponent(
      document.cookie.replace(/(?:(?:^|.*;\s*)cookieData\s*=\s*([^;]*).*$)|^.*$/, '$1')
    );
    if (cookieString) {
      setCookieData(JSON.parse(cookieString));
    } else {
      setCookieData(dummyData);
    }
  }, []);

  const addToCookies = () => {
    const newData: IData = { id: cookieData.length + 1, name: 'New Name' };
    const updatedData = [...cookieData, newData];
    document.cookie = `cookieData=${encodeURIComponent(JSON.stringify(updatedData))}`;
    setCookieData(updatedData);
  };

  const removeFromCookies = (id: number) => {
    const updatedData = cookieData.filter((item) => item.id !== id);
    document.cookie = `cookieData=${encodeURIComponent(JSON.stringify(updatedData))}`;
    setCookieData(updatedData);
  };

  // Cache Storage (Service Workers)
  useEffect(() => {
    const fetchDataFromCacheStorage = async () => {
      try {
        const cache = await caches.open('example_cache');
        const response = await cache.match('example_data');
        if (response) {
          const responseData = await response.json();
          setCacheStorageData(responseData);
        }
      } catch (error) {
        console.error('Error fetching data from Cache Storage:', error);
      }
    };

    fetchDataFromCacheStorage();
  }, []);

  // Update data in Cache Storage
  const updateCacheData = async () => {
    try {
      const newData: IData = { id: 4, name: 'New Name' };
      const cache = await caches.open('example_cache');
      await cache.put('example_data', new Response(JSON.stringify(newData)));
      setCacheStorageData(newData);
    } catch (error) {
      console.error('Error updating data in Cache Storage:', error);
    }
  };

  // Clear data from Cache Storage
  const clearCacheData = async () => {
    try {
      const cache = await caches.open('example_cache');
      await cache.delete('example_data');
      setCacheStorageData(null);
    } catch (error) {
      console.error('Error clearing data from Cache Storage:', error);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Hello world</h1>
      <p style={{ width: '100%', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Count: {count}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ margin: 'auto', width: '100%' }} onClick={increment}>
          Increment
        </button>
        <button style={{ margin: 'auto', width: '100%' }} onClick={decrement}>
          Decrement
        </button>
      </div>
      <div>
        <h2>Local Storage</h2>
        <ul>
          {localStorageData.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => removeFromLocalStorage(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={addToLocalStorage}>Add New Item</button>

        <h2>Session Storage</h2>
        <ul>
          {sessionStorageData.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => removeFromSessionStorage(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={addToSessionStorage}>Add New Item</button>

        <h2>IndexedDB</h2>
        <ul>
          {indexedDBData.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => removeFromIndexedDB(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={addToIndexedDB}>Add New Item</button>

        <h2>Cookies</h2>
        <ul>
          {cookieData.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => removeFromCookies(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={addToCookies}>Add New Item</button>
      </div>

      <div>
        <h2>Cache Storage</h2>
        {cacheStorageData && (
          <div>
            <p>ID: {cacheStorageData.id}</p>
            <p>Name: {cacheStorageData.name}</p>
          </div>
        )}
        <button onClick={updateCacheData}>Update Cache Data</button>
        <button onClick={clearCacheData}>Clear Cache Data</button>
      </div>
    </>
  );
}

export default App;
