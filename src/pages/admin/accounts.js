import { useLoadingContext } from '@/providers/LoadingProvider';
import AccountTable from '@/components/Accounts/AccountTable';
import { accountsService, userService } from '@/services';
import isAuth from '@/components/Auth/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { Box } from '@mantine/core';

const AdminAccountsTable = () => {
  const [accounts, setAccount] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadingContext = useLoadingContext();
  const router = useRouter()

  const refreshAccounts = async () => {
    try {
      loadingContext.setIsLoading(true);
      const res = await accountsService.getAllAccounts(currentPage);

      if (res.accounts.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setAccount(res.accounts);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      loadingContext.setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage > 0) {
      refreshAccounts()
    }
  }, [currentPage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role === "ADMIN" || userService.userValue?.role === "SUBADMIN") {
          router.push("/admin/accounts");
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
        <Helmet title="Trade Dept | Accounts" />
        <AccountTable
          aList={accounts} currentPage={currentPage}
          totalPages={totalPages} setCurrentPage={setCurrentPage}
          refreshAccounts={refreshAccounts} />
      </Box>
    </>
  )
}
export default isAuth(AdminAccountsTable)