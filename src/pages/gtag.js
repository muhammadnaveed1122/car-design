import { useEffect } from 'react';

function GTag() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-0WNVZ49VGE';
        script.async = true;
        document.body.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-0WNVZ49VGE');

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}

export default GTag;
