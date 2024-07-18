import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const OverdueTimelines = () => {
  const [overdueTimelines, setOverdueTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverdueTimelines();
  }, []);

  const fetchOverdueTimelines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timelines/overdue');
      setOverdueTimelines(response.data);
    } catch (error) {
      console.error('Error fetching overdue timelines:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Deadline',
      selector: row => row.deadline ? new Date(row.deadline).toLocaleDateString() : 'N/A',
      sortable: true,
      width: '200px',
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2>Overdue Timelines</h2>
      {overdueTimelines.length > 0 ? (
        <DataTable
          columns={columns}
          data={overdueTimelines}
          pagination
        />
      ) : (
        <p>No overdue timelines found.</p>
      )}
    </>
  );
};

export default OverdueTimelines;
