import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to agents page as it's now the main dashboard
    navigate('/agents', { replace: true });
  }, [navigate]);

  return null;
}

