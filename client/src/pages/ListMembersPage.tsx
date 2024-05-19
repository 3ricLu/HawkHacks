import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Member {
  username: string;
}

const ListMembersPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`/api/listings/${listingId}/members`);
        setMembers(response.data.members);
      } catch (error) {
        setError('Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [listingId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Members of Listing {listingId}</h1>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListMembersPage;
