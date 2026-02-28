import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-8">
      <ol className="flex items-center flex-wrap gap-1 text-sm sm:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight size={14} className="text-gray-400 mx-1" />
              )}
              {isLast ? (
                <span className="text-primary font-bold">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-secondary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
