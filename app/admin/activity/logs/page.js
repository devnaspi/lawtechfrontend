'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import axiosInstance from '@/lib/axios';

const ActivityLogsPage = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await axiosInstance.get('/api/activity-tracking/activity-logs');
        setActivityLogs(response.data.results);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Activity Logs
      </Typography>

      {activityLogs.length > 0 ? (
        activityLogs.map((log, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">{log.description}</Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(log.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No activity logs found.</Typography>
      )}
    </Container>
  );
};

export default ActivityLogsPage;
