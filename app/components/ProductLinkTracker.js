'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export default function ProductLinkTracker() {
    useEffect(() => {
        const handleProductClick = (e) => {
            // Check if the clicked element or its parent is the product link
            const productLink = e.target.closest('.productLink');

            if (productLink) {
                // Send GA4 Event
                sendGAEvent('event', 'click_purchase_button', {
                    event_category: 'conversion',
                    event_label: 'smartstore_link',
                    product_name: 'solarwheel',
                    link_url: productLink.href
                });

                console.log('GA4 Event Sent: click_purchase_button');
            }
        };

        // Attach event listener to the document to handle the click
        // filtering for .productLink class
        document.addEventListener('click', handleProductClick);

        return () => {
            document.removeEventListener('click', handleProductClick);
        };
    }, []);

    return null; // This component renders nothing
}
