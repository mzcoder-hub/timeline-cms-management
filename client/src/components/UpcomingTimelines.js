import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const UpcomingTimelines = () => {
  const [upcomingTimelines, setUpcomingTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingTimelines();
  }, []);

  const fetchUpcomingTimelines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timelines/upcoming', {
        headers : {
         Authorization : `${localStorage.getItem('token')}`
        }
      });
      setUpcomingTimelines(response.data);
    } catch (error) {
      console.error('Error fetching upcoming timelines:', error);
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
      <h2>Upcoming Timelines</h2>
      {upcomingTimelines.length > 0 ? (
        <DataTable
          columns={columns}
          data={upcomingTimelines}
          pagination
        />
      ) : (
        <p>No upcoming timelines found.</p>
      )}
    </>
  );
};

export default UpcomingTimelines;
