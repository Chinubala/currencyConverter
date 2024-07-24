import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import './Currency.css';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

const Exchange = () => {
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState('INR');
    const [exchangeRate, setExchangeRate] = useState('')
    const [historyExchangeRate, setHistoryExchangeRate] = useState(0)
    const [conversionRates, setConversionRates] = useState([]);
    const [amount, setAmount] = useState(1);
    const [history, setHistory] = useState([])
    const [dateValue, setDateValue] = useState({ year: '', month: '', day: '', fullData: '' })
    const dateFormat = 'YYYY-MM-DD';
    const todayDate = new Date();
    const day = todayDate.getDate();
    const month = todayDate.getMonth() + 1; // getMonth() returns month from 0 to 11
    const year = todayDate.getFullYear();
    const dateStr = `${year}-${month}-${day}`;


    useEffect(() => {
        const BASE_URL = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/latest/${fromCurrency}`

        fetch(BASE_URL)
            .then(res => res.json())
            .then(data => {
                const fristCurrency = Object.keys(data.conversion_rates)[0];
                setCurrencyOptions([data.base_code, ...Object.keys(data.conversion_rates)])
                setConversionRates([{ ...data.conversion_rates }])
            })

        const history_BASE_URL = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/history/${fromCurrency}/${year}/${month}/${day}`;
        // const history_url = `https://api.fastforex.io/historical?date=${dateString}&api_key=2bf819820f-3f52629cff-sh449q`
        fetch(history_BASE_URL)
            .then(res => res.json())
            .then(data => {
                setConversionRates([{ ...data?.conversion_rates }])
                const currencyRate = conversionRates;
                if (toCurrency !== '') {
                    if(currencyRate[0]){
                        setHistoryExchangeRate(currencyRate[0][toCurrency])
                    }         
                } else {
                    setHistoryExchangeRate(0);
                }
                console.log("date", dateStr, day , month , year )
                setDateValue({ year: year, month: month, day: day, fullData: dateStr });
            })
    }, [])

    useEffect(() => {
        setDateValue({ year: year, month: month, day: day, fullData: dateStr });
        if(dateValue.year !== ""){
            historyExchangeRateAPI();
        }
      
    }, [toCurrency]);
    function handleToAmountChange(e) {
        e.preventDefault();
        setAmount(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const exchage_base_url = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/pair/${fromCurrency}/${toCurrency}/${amount}`;
        fetch(exchage_base_url)
            .then(res => res.json())
            .then(data => setExchangeRate(data.conversion_result)
            )
    }

    const onChange = async (date, dateString) => {
        const dateStr = `${date?.$y}-${date?.$M + 1}-${date?.$D}`;
        setDateValue({ year: date?.$y, month: date?.$M + 1, day: date?.$D, fullData: dateStr })
        historyExchangeRateAPI();

    };

    const historyExchangeRateAPI = () => {
        const history_BASE_URL = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/history/${fromCurrency}/${dateValue?.year}/${dateValue?.month}/${dateValue?.day}`;
        // const history_url = `https://api.fastforex.io/historical?date=${dateString}&api_key=2bf819820f-3f52629cff-sh449q`
        fetch(history_BASE_URL)
            .then(res => res.json())
            .then(data => {
                setConversionRates([{ ...data.conversion_rates }])
                const currencyRate = conversionRates;
                if (toCurrency !== '') {
                    setHistoryExchangeRate(currencyRate[0][toCurrency])
                } else {
                    setHistoryExchangeRate(0);
                }
            })
    }


    return (
        <div className='container-fluid'>
            <div className='row'>
                <form>
                    <div className='card mx-auto' style={{ width: "40%" }}>
                        <div className='card-header'>
                            <h1>Currency converter</h1>
                        </div>
                        <div className='card-body'>
                            <div className='mb-3'>
                                <TextField id="outlined-basic" label="Amount to convert:" variant="outlined" style={{ width: "72%" }} value={amount} onChange={handleToAmountChange} />
                            </div>
                            <div className='mb-3'>
                                <FormControl sx={{ m: 1, minWidth: 415 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">From</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={fromCurrency}
                                        onChange={e => setFromCurrency(e.target.value)}
                                        sx={{ m: 1, minWidth: 415 }}
                                        label="From"
                                    >
                                        {currencyOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>

                                        ))}

                                    </Select>
                                </FormControl>
                            </div>

                            <div className='exchange_icon mb-3'><span><AiOutlineArrowDown />
                            </span><span><AiOutlineArrowUp /></span>
                            </div>
                            <div>
                                <FormControl sx={{ m: 1, minWidth: 415 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">To</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={toCurrency}
                                        onChange={e => setToCurrency(e.target.value)}
                                        sx={{ m: 1, minWidth: 415 }}
                                        label="To"
                                    >
                                        {currencyOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>

                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div><button onClick={handleSubmit} className="btn btn1" >Submit</button></div>
                            <TextField id="outlined-basic" variant="outlined" style={{ width: "72%" }} value={exchangeRate} />
                            <div className='card-header'>
                                <h1>Historical Exchange Rates</h1>
                            </div>
                            <div>
                                <label style={{ paddingLeft: '50px' }}>Change Dates</label>
                                <Space direction="vertical" style={{ width: "87%" }}>
                                    <DatePicker

                                        onChange={onChange}
                                        style={{ width: "87%" }}
                                        defaultValue={dayjs('2024-07-24', dateFormat)}
                                        format={dateFormat}
                                    />

                                </Space>
                            </div>
                            {historyExchangeRate ? <div>
                                <h6>{`1 ${fromCurrency} = ${historyExchangeRate} ${toCurrency}`}</h6>
                            </div> : ''}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Exchange
