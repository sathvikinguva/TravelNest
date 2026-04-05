import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const OAuthCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      showToast('OAuth login failed. Missing token.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    try {
      completeOAuthLogin(token);
      showToast('Signed in successfully.', 'success');
      navigate('/', { replace: true });
    } catch {
      showToast('Invalid login token. Please try again.', 'error');
      navigate('/login', { replace: true });
    }
  }, [completeOAuthLogin, navigate, params, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-600 font-semibold">
      Finalizing sign-in...
    </div>
  );
};

export default OAuthCallbackPage;
