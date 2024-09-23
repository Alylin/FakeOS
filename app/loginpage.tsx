import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const newUsers = await fetch('/api/test', {
        method: 'GET',
      });

      setUsers(await newUsers.json());
    };
    fetchData();
  }, []);

  if (users === null) {
    return (
      <div>
        loading
      </div>
    );
  }

  return (
    <div>
      loaded
    </div>
  );
}
