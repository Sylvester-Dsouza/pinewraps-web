import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

const SuccessPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const { ref, orderId, orderNumber } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for query params to be available
    if (ref && orderId) {
      setLoading(false);
    }
  }, [ref, orderId]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.success.main 
          }} 
        />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Successful!
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. Your payment has been processed successfully.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Order Number: <strong>{orderNumber}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reference: {ref}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Link href={`/orders/${orderId}`} passHref>
            <Button variant="contained" color="primary">
              View Order
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outlined">
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SuccessPage;
