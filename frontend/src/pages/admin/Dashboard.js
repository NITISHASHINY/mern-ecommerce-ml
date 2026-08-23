import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import { adminAPI } from '../../services/adminApi';
import { productAPI } from '../../services/api';
import { mlAPI } from '../../services/mlApi';
import AdminLayout from '../../components/layout/AdminLayout';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ borderRadius: 4, height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontFamily='"Playfair Display", serif'>
            {value}
          </Typography>
        </Box>
        <Box sx={{ fontSize: '2.5rem' }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: productStats, isLoading: productLoading } = useQuery(
    'productStats',
    () => productAPI.getStats()
  );

  const { data: orderStats, isLoading: orderLoading } = useQuery(
    'orderStats',
    () => adminAPI.getOrderStats()
  );

  const { data: mlStats, isLoading: mlLoading } = useQuery(
    'mlStats',
    () => mlAPI.getStats()
  );

  const { data: orders, isLoading: ordersLoading } = useQuery(
    'orders',
    () => adminAPI.getOrders()
  );

  if (productLoading || orderLoading || mlLoading || ordersLoading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#EFA5B6' }} />
        </Box>
      </AdminLayout>
    );
  }

  const productData = productStats?.data?.data || {};
  const orderData = orderStats?.data?.data || {};
  const mlData = mlStats?.data?.data || {};
  const ordersList = orders?.data?.data || [];

  const totalRevenue = ordersList
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={productData.totalProducts || 0}
            icon="🍓"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={orderData.totalOrders || 0}
            icon="📦"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon="💰"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ML Interactions"
            value={mlData.total_interactions || 0}
            icon="🤖"
          />
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
          Recent Orders
        </Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#FFF5F0' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Order #</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.slice(0, 5).map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>{order.orderNumber}</td>
                    <td style={{ padding: '12px 16px' }}>{order.guestEmail || 'Guest'}</td>
                    <td style={{ padding: '12px 16px' }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: order.status === 'delivered' ? '#BFD8B8' : 
                                   order.status === 'cancelled' ? '#F8D7DA' : '#FFC6A8',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default Dashboard;