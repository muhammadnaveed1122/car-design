import { useState, useEffect } from 'react';
import { alertService } from '@/services';
import { useRouter } from 'next/router';

export { Alert };

function Alert() {
  const router = useRouter();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const subscription = alertService.alert.subscribe(alert => setAlert(alert));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    alertService.clear();
  }, [router]);

  if (!alert) return null;

  return (
    <div className="container">
      <div className="m-3">
        <div className={`alert alert-dismissible ${alert.type}`}>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => alertService.clear()}></button>
        </div>
      </div>
    </div>
  );
}