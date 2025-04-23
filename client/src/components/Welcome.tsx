import { ClipboardList, PackageSearch, BarChart3, ShoppingCart, Settings, Users, Layout } from 'lucide-react';

function Welcome() {
  const guideCards = [
    {
      title: 'Budget Overview',
      description: 'Start by viewing your current budget levels or creating a budget.',
      icon: <PackageSearch className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/budget'
    },
    {
      title: 'Product Categories',
      description: 'Organize and manage your product categories effectively.',
      icon: <Layout className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/category'
    },
    {
      title: 'Product Management',
      description: 'Create and manage products within the inventory system.',
      icon: <Users className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/product'
    },
    {
      title: 'Stock Management',
      description: 'Monitor and update stock levels across your inventory.',
      icon: <ClipboardList className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/purchase'
    },
    {
      title: 'Sales Management',
      description: 'Create and manage sales transactions for your products efficiently.',
      icon: <ShoppingCart className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/sale'
    },
    {
      title: 'Reports & Analytics',
      description: 'Track performance metrics and generate detailed sales reports.',
      icon: <BarChart3 className="w-6 h-6 text-[#8B5CF6]" />,
      link: '/revenue'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and customize your account.',
      icon: <Settings className="w-6 h-6 text-[#8B5CF6]" />,
      link: '#'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Inventory Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with our comprehensive inventory management system. Follow the guide below to learn about key features and functionalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guideCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#8B5CF6] transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-teal-50 rounded-lg p-3">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {card.description}
              </p>
              <a
                href={card.link}
                className="inline-flex items-center text-[#8B5CF6] hover:text-blue-800 font-medium"
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcome;