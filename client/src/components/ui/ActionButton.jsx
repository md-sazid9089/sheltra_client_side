import './ActionButton.css';

const ActionButton = ({ children, onClick, variant = 'primary' }) => {
    return (
        <button className={`action-button action-button--${variant}`} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="action-button__arrow action-button__arrow--left" viewBox="0 0 24 24">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
            </svg>
            <span className="action-button__text">{children}</span>
            <span className="action-button__circle" />
            <svg xmlns="http://www.w3.org/2000/svg" className="action-button__arrow action-button__arrow--right" viewBox="0 0 24 24">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
            </svg>
        </button>
    );
};

export default ActionButton;
