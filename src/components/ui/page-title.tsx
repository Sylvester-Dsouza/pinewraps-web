import Link from 'next/link';

interface PageTitleProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

const PageTitle = ({ title, description, children, breadcrumbs }: PageTitleProps) => {
  const displayTitle = title || children;
  
  return (
    <div className="bg-black text-white py-12 w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>
        {description && (
          <p className="text-gray-300 text-lg mb-4">{description}</p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <Link
                  href={crumb.href}
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
