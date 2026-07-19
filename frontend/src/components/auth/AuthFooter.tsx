// Simple route prompt shared by related authentication forms.
import { Link } from 'react-router-dom';

interface AuthFooterProps {
  prompt: string;
  action: string;
  to: string;
}

export const AuthFooter = ({ prompt, action, to }: AuthFooterProps) => {
  return (
    <p className="auth-footer">
      {prompt} <Link to={to}>{action}</Link>
    </p>
  );
};
