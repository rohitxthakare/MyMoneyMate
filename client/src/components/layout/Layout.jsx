import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>
        <Footer />
    </div>
  );
};

export default Layout;