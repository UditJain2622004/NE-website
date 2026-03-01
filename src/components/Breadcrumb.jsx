import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-8">
      <ol className="text-xs md:text-base leading-relaxed">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline">
              {index > 0 && (
                <span className="inline-flex items-center mx-1 align-middle">
                  <ChevronRight size={14} className="text-gray-400" />
                </span>
              )}
              {isLast ? (
                <span className="text-primary font-bold align-middle">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-secondary transition-colors font-medium align-middle"
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
