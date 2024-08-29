import React, { useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  IconButton,
  Box,
  Stack,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { IconCalendar, IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import BlankCard from 'src/components/shared/BlankCard';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useLazyFetchCoachesQuery } from 'src/services/coaches';
import { useSelector } from 'src/store/Store';
import './Coaches.css';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Coaches List',
  },
];

const Coaches = () => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10; // Fixed at 10 per page

  const [request, response] = useLazyFetchCoachesQuery()

  const stadium = useSelector((state) => state.configReducer.selectedStadium)

  useEffect(() => {
    if (stadium) {
      request({
        stadium_id: stadium?.id,
        page: page + 1
      })
    }
  }, [stadium, page])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const rows = response?.data?.data || [];
  const meta = response?.data?.meta_data || undefined;

  return (
    <PageContainer>
      <Breadcrumb title="Coaches List" items={BCrumb} />

      <BlankCard>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width="25%">
                  <Typography variant="h6">User</Typography>
                </TableCell>
                <TableCell width="25%">
                  <Typography variant="h6">Language</Typography>
                </TableCell>
                <TableCell width="25%">
                  <Typography variant="h6">Bio</Typography>
                </TableCell>
                <TableCell width="25%">
                  <Typography variant="h6">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={row.image} alt={row.image} className="coaches-avatar" />
                      <Box>
                        <Typography variant="h6">{row.name}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell scope="row">
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.spoken_languages.map(lang =>
                        lang === 'ar' ? 'العربية' :
                          lang === 'en' ? 'English' :
                            lang
                      ).join(' , ')}
                    </Typography>
                  </TableCell>

                  <TableCell scope="row">
                    <Tooltip title={row.bio} arrow>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        className="coaches-bio-text"
                      >
                        {row.bio}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Calendar">
                        <IconButton
                          color="primary"
                          className="coaches-action-button coaches-action-button-calendar"
                        >
                          <IconCalendar width={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Packages">
                        <IconButton
                          color="secondary"
                          className="coaches-action-button coaches-action-button-packages"
                        >
                          <IconPlus width={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="info"
                          className="coaches-action-button coaches-action-button-edit"
                        >
                          <IconEdit width={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          className="coaches-action-button coaches-action-button-delete"
                        >
                          <IconTrash width={20} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={meta?.total || rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10]}
          onRowsPerPageChange={undefined}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default Coaches;