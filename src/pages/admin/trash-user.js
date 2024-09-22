import TrashUserManageTable from '@/components/TrashUsers/TrashUserManageTable';
import { useLoadingContext } from '@/providers/LoadingProvider';
import isAuth from '@/components/Auth/auth';
import { useState, useEffect } from 'react';
import { userService } from '@/services';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { Box } from '@mantine/core';

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadingContext = useLoadingContext();
  const router = useRouter()

  const refreshUsers = async () => {
    loadingContext.setIsLoading(true);
    userService.getAllTrashedUser(currentPage).then((res) => {
      if (res.users.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        setUsers(res.users);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
        loadingContext.setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (currentPage > 0) {
      loadingContext.setIsLoading(true);
      userService.getAllTrashedUser(currentPage).then((res) => {
        setUsers(res.users);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
        loadingContext.setIsLoading(false);
      });
    }
  }, [currentPage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role !== "ADMIN") {
          router.push("/");
        }
      })
    } else {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Box mih={700}>
        <Helmet title="Trade Dept | Trash Users" />

        <TrashUserManageTable
          uList={users} currentPage={currentPage}
          totalPages={totalPages} setCurrentPage={setCurrentPage}
          refreshUsers={refreshUsers}
        />
      </Box>
    </>
  )
}
export default isAuth(AdminUsersTable)