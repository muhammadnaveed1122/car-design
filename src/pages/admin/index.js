import { useLoadingContext } from '@/providers/LoadingProvider';
import { userService } from '@/services';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminHome() {
  const router = useRouter();
  const loadingContext = useLoadingContext();
  useEffect(() => {
    loadingContext.setIsLoading(false);
    router.push('/admin/users');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userService?.userValue]);

  return (
    <div style={{ minHeight: 700 }}>
    </div>
  )
}