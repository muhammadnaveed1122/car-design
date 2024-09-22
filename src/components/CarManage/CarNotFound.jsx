// pages/404.js

import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="container">
      <h1 className="title">404 - Car Not Found</h1>
      <Link href="/">
        Go back to home
      </Link>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          text-align: center;
        }
        .title {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .link {
          color: blue;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
