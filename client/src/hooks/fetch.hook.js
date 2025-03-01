import { useState, useEffect } from "react";
import axios from "axios";
import {getUsername} from '../helper/helper';
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


export default function useFetch(query) {
    const [dataState, setDataState] = useState({
        isLoading: false,
        apiData: null,
        status: null,
        serverError: null,
    });

    useEffect(() => {
        if (!query) return; 

        const fetchData = async () => {
            try {
                // Start loading
                setDataState(prev => ({ ...prev, isLoading: true }));

                // Fetch data
                const response = await axios.get(query);

                // Handle success response
                setDataState({
                    isLoading: false,
                    apiData: response.data,
                    status: response.status,
                    serverError: null,
                });
            } catch (error) {
                // Handle error response
                setDataState({
                    isLoading: false,
                    apiData: null,
                    status: null,
                    serverError: error.response?.data || error.message,
                });
            }
        };

        fetchData();
    }, [query]);

    return [dataState, setDataState];
}
