import CustomerManageTable from '@/components/CutomerMange/customerTable'
import { useLoadingContext } from '@/providers/LoadingProvider';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import { carService } from '@/services';
import { Helmet } from 'react-helmet';
import { Box } from '@mantine/core';

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const loadingContext = useLoadingContext();


  const fetchCustomer = async () => {
    loadingContext.setIsLoading(true);
    carService.getAllCusmtoer(currentPage).then((res) => {
      if (res.customer.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        setUsers(res.customer);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
        loadingContext.setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    if (currentPage > 0) {
      loadingContext.setIsLoading(true);
      carService.getAllCusmtoer(currentPage).then((res) => {
        setUsers(res.customer);
        setCurrentPage(Number(res.currentPage));
        setTotalPages(res.totalPages);
        loadingContext.setIsLoading(false);
      });
    }
  }, [currentPage]);

  return (
    <>
      <Box mih={700}>
        <Helmet title="Trade Dept | Customers" />

        <CustomerManageTable
          uList={users} currentPage={currentPage}
          totalPages={totalPages} setCurrentPage={setCurrentPage}
          fetchCustomer={fetchCustomer}
        />
      </Box>
    </>
  )
}
export default isAuth(Customer)