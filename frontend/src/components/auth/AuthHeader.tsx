// Heading and supporting copy shared across authentication pages.
interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <header className="auth-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};
