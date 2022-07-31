import { useEffect, useState } from "react";

import axios from "axios";

const callExternalAPIOnInterval = (timeInterval, url, headers = {}) => {
    const [data, setData] = useState();

    useEffect(() => {
        const getAPIData = async () => {
            const { data } = await axios.get(url, { headers });
            setData(data);
        };

        getAPIData();
        const interval = setInterval(getAPIData, timeInterval);
        return () => clearInterval(interval);
    }, []);

    return data;
};

export default callExternalAPIOnInterval;
