import React from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

const ErrorPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const { message, ref, status } = router.query;

  const getErrorMessage = () => {
    if (status === 'CANCELLED') {
      return 'Your payment was cancelled.';
    }
    return message || 'An error occurred while processing your payment.';
  };

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
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.error.main 
          }} 
        />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Failed
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {getErrorMessage()}
        </Typography>

        {ref && (
          <Typography variant="body2" color="text.secondary">
            Reference: {ref}
          </Typography>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Link href="/checkout" passHref>
            <Button variant="contained" color="primary">
              Try Again
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outlined">
              Return to Home
            </Button>
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          If you continue to experience issues, please contact our support team.
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;
