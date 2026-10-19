import { useEffect, useState } from "react";

import axios from "axios";

const useExternalAPIOnInterval = <T = any>(timeInterval: number, url: string): T | undefined => {
    const [data, setData] = useState<T>();

    useEffect(() => {
        const getAPIData = async () => {
            try {
                const { data } = await axios.get<T>(url);
                setData(data);
            } catch (error) {
                // Log without the query string so API keys don't end up in the logs
                const { origin, pathname } = new URL(url);
                console.error(`Failed to fetch ${origin}${pathname}:`, error);
            }
        };

        getAPIData();
        const interval = setInterval(getAPIData, timeInterval);
        return () => clearInterval(interval);
    }, [timeInterval, url]);

    return data;
};

export default useExternalAPIOnInterval;
