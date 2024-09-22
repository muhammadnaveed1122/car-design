import { useLoadingContext } from '@/providers/LoadingProvider';
import { adminService, userService } from '@/services';
import AList from '@/components/Admin/ALIst';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { Box } from '@mantine/core';

const AdminList = () => {
  const [admins, setAdmin] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadingContext = useLoadingContext();
  const router = useRouter()

  const refreshAdmins = async () => {
    try {
      loadingContext.setIsLoading(true);
      const res = await adminService.getAllAdmin(currentPage);

      if (res.admins.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setAdmin(res.admins);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      // Handle the error as needed, e.g., show an error message
    } finally {
      loadingContext.setIsLoading(false);
    }
  };


  useEffect(() => {
    if (currentPage > 0) {
      refreshAdmins()
    }
  }, [currentPage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role === "ADMIN") {
          router.push("/admin/admins");
        } else {
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
        <Helmet title="Trade Dept | Admins" />

        <AList
          aList={admins} currentPage={currentPage}
          totalPages={totalPages} setCurrentPage={setCurrentPage}
          refreshAdmins={refreshAdmins}
        />
      </Box>
    </>
  )
}
export default isAuth(AdminList)