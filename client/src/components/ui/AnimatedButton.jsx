import './AnimatedButton.css';

const AnimatedButton = ({ children, onClick, variant = 'primary' }) => {
    return (
        <button className={`animated-button animated-button--${variant}`} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="animated-button__arrow animated-button__arrow--left" viewBox="0 0 24 24">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
            </svg>
            <span className="animated-button__text">{children}</span>
            <span className="animated-button__circle" />
            <svg xmlns="http://www.w3.org/2000/svg" className="animated-button__arrow animated-button__arrow--right" viewBox="0 0 24 24">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
            </svg>
        </button>
    );
};

export default AnimatedButton;
