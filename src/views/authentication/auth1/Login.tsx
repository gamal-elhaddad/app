import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/apps/auth/AuthSlice';
import { useLoginMutation } from 'src/services/auth';
import { useNavigate } from 'react-router';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation()

  const [loginRequest] = useLoginMutation()


  const handleSubmit = async (values: { email: string; password: string }) => {

    loginRequest({
      email: values.email,
      password: values.password
    }).then((result) => {
     dispatch(setUser(result))

     navigate('/dashboards/modern')

    }).catch((error) => {
      console.error('Login error:', error);

    })




    // dispatch(setUser({
    //   // Set user data based on the result

    // }));


    // navigate('/dashboards/modern');


  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={7}
          xl={8}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            <Box px={3}>
              <Logo />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              height={'calc(100vh - 75px)'}
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4}>
            <AuthLogin
              title={t('Login.title')}
              onSubmit={handleSubmit}
              subtext={
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                  Your Admin Dashboard
                </Typography>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;