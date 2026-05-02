export default function ApplicationLogo(props) {
    return (
        <img 
            src="/images/logo.png" 
            alt="AfriTest Logo" 
            {...props} 
            className={`object-contain ${props.className || 'h-10 w-auto'}`}
        />
    );
}
