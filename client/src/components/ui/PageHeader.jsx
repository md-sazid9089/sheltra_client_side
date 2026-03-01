/**
 * Modern Page Header Component
 * With title, subtitle, breadcrumbs, and action buttons
 */
export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    actions,
    backButton,
    className = '',
}) {
    return (
        <div className={`mb-8 ${className}`}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex mb-3" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {crumb.href ? (
                                    <a 
                                        href={crumb.href} 
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-sm font-medium text-gray-400">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            
            {/* Header content */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {backButton && (
                        <button
                            onClick={backButton.onClick}
                            className="flex-shrink-0 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-base md:text-lg text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Actions */}
                {actions && (
                    <div className="flex items-center gap-3 flex-wrap">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
