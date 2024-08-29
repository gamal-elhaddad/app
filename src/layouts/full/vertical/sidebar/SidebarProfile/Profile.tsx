import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'src/store/Store';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';
import { AppState } from 'src/store/Store';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/store/apps/auth/AuthSlice';

export const Profile = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const user = useSelector((state: AppState) => state.authReducer.user);

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={user?.data?.image_url || img1} />

          <Box>
            <Typography sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }} variant="h6">{user?.data?.name}</Typography>
            <Typography variant="caption" sx={{
              width: 100,
              display: '-webkit-box',
              overflow: 'hidden',
            }}>{user?.data?.email}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top" onClick={() => {
              dispatch(logout())
              navigate('/auth/login')
            }}>
              <IconButton
                color="primary"
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
