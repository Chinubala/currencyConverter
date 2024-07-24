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
    const [toCurrency, setToCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState('')
    const [conversionRates , setConversionRates]  = useState([]);
    const [amount, setAmount] = useState(1);
    const [history , setHistory] = useState([])
    const [dateValue , setDateValue] = useState({year: '', month: '', day: ''})
    const dateFormat = 'YYYY-MM-DD';


    useEffect(() => {
        const BASE_URL = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/latest/${fromCurrency}`
        console.log("URL", BASE_URL);

        fetch(BASE_URL)
            .then(res => res.json())
            .then(data => {
                const fristCurrency = Object.keys(data.conversion_rates)[0];
                setCurrencyOptions([data.base_code, ...Object.keys(data.conversion_rates)])
                setConversionRates([{...data.conversion_rates}])
            })
    }, [])
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
        
        setDateValue({year: date?.$y, month: date?.$M + 1, day: date?.$D})
        // const history_BASE_URL = `https://v6.exchangerate-api.com/v6/d88161f4605cd0c43b9f0ec5/history/${fromCurrency}/${date?.$y}/${date?.$M + 1}/${date?.$D}`;
        const history_url = `https://api.fastforex.io/historical?date=${dateString}&api_key=2bf819820f-3f52629cff-sh449q`
        fetch(history_url)
            .then(res => res.json())
            .then(data => { setHistory(data.results);})
       
      };

      const getConversionRate = (curr) => {
          const currencyRate= conversionRates;
          if(toCurrency !== ''){
            return currencyRate[0][curr]
          } else {
            return 0;
          }
          console.log("helloo",currencyRate[0]['AMD'])
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
                            <div>

                                <Space direction="vertical" style={{ width: "87%" }}>
                                    <DatePicker 
                                    onChange={onChange} 
                                    style={{ width: "87%" }}
                                    defaultValue={dayjs('2024-07-25', dateFormat)}
                                    format={dateFormat}
                                    />

                                </Space>
                            </div>
                            <div><button onClick={handleSubmit} className="btn btn1" >Submit</button></div>
                            <TextField id="outlined-basic" variant="outlined" style={{ width: "72%" }} value={exchangeRate} />
                          {conversionRates.length > 0 ?  <div>
                                <h6>{`1 ${fromCurrency} = ${getConversionRate(toCurrency)} ${toCurrency}`}</h6>
                            </div>: ''}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Exchange
