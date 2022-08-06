import { useEffect, useState } from "react";

import axios from "axios";

const callExternalAPIOnInterval = (
    timeInterval: number,
    url: string,
    headers = {}
): any | any[] | undefined => {
    const [data, setData] = useState<any | any[]>();

    useEffect(() => {
        const getAPIData = async () => {
            try {
                const { data } = await axios.get(url, { headers });
                setData(data);
            } catch (error) {}
        };

        getAPIData();
        const interval = setInterval(getAPIData, timeInterval);
        return () => clearInterval(interval);
    }, []);

    return data;
};

export default callExternalAPIOnInterval;
