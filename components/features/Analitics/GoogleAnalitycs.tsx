import Script from 'next/script'

const GoogleAnalytics = () => {
    const gmtId = process.env.NEXT_PUBLIC_GA_ID

    return (
        <>
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gmtId}`}
            />
            <Script
                id="gmt"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gmtId}'
            `,
                }}
            />
        </>
    )
}

export default GoogleAnalytics
