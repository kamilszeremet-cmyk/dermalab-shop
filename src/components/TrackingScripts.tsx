import type { TrackingConfig } from "../domain/tracking";

interface TrackingScriptsProps {
  config: TrackingConfig;
}

export function TrackingScripts({ config }: TrackingScriptsProps) {
  if (!config.enabled) return null;

  return (
    <>
      {config.ga4Id && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${config.ga4Id}');
              `,
            }}
          />
        </>
      )}
      {config.metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
