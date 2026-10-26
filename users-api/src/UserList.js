import { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [listOfUser, setListOfUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setListOfUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Unable to load users. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="status-message">Loading users...</p>;
  }

  if (error) {
    return <p className="status-message status-error">{error}</p>;
  }

  return (
    <ul className="user-list">
      {listOfUser.map((user) => (
        <li key={user.id} className="user-card">
          <div className="user-card-top">
            <div className="avatar">{user.name.charAt(0)}</div>
            <div>
              <h2 className="user-name">{user.name}</h2>
              <p className="user-username">@{user.username}</p>
            </div>
          </div>

          <ul className="user-details">
            <li>
              <span className="detail-label">Email</span>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </li>
            <li>
              <span className="detail-label">Phone</span>
              <span>{user.phone}</span>
            </li>
            <li>
              <span className="detail-label">Website</span>
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </li>
            <li>
              <span className="detail-label">Company</span>
              <span>{user.company.name}</span>
            </li>
            <li>
              <span className="detail-label">City</span>
              <span>{user.address.city}</span>
            </li>
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default UserList;
