import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="col-span-1 md:col-span-2">
            <div className="text-xl text-gray-800 font-semibold mb-4">MyMoneyMate</div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Manage your finances with MyMoneyMate, an AI-powered platform to track income and expenses, 
              analyze spending by category, and get smart budget recommendations and saving suggestions.
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/transactions" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Transactions</Link></li>
              <li><Link to="/assistant" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">AI Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/rohitxthakare/MyMoneyMate" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">GitHub</a></li>
              <li><a href="mailto:rohitthakare032@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">rohitthakare032@gmail.com</a></li>
              <li className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © {(new Date).getFullYear()} MyMoneyMate. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              Made with ❤️ for better financial management
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;