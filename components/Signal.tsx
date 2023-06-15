import {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {useTable} from "react-table";
import { RemoveRedEye } from "@mui/icons-material";
import useSWR from "swr";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import useStore from "../store";
import {getSignal} from "@/lib/api/signal";

const Container = styled.div`
    width:100%;
    height:100%;
    display:flex;
    padding:20px;
    justify-content: space-between;
`
const PrettyTable = styled.table`
    width:100%;
  height: auto;
    padding:5px;
    border-radius:10px;
    thead > tr {
        border-bottom: 2px solid ${p=>p.theme.colors.invertColor};
        th::after {
            content:'';
            width:1px;
            position:absolute;
            top:0;
            left:0;
            bottom:0;
            background-color: white;
        }
    }
    td {
            text-align:center;
    }
`
const Adjust = styled.div`
    display:flex;
    flex-direction: column;
    gap:10px;
`
const BubbleBox = styled.div`
    width:100%;
    height:100%;
`

const PositionColor = styled.div<{isShort:boolean}>`
    color:${p=>p.isShort ? p.theme.colors.signatureRed : p.theme.colors.signatureMint};
`

const PayBtn  =styled.div`
    width:100%;

    height:2em;
    border-radius:5px;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: ${p=>p.theme.colors.signatureBlue};
`
const OptionBlock = styled.div`
    height:100px;
    width:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;

    div {
        margin:5px;
        padding:0;
        margin-top:10px;
        border:none;
        border-radius: 10px;
    }
    div > div {
        background-color: ${p=>p.theme.colors.signatureBlue};
    }
    div > div:last-child {
        div {
            color:white;
        }
        div:hover {
            background-color: #232f80;
        }
        &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
        
    }
    div > div > div {
        padding-left:5px;
    }
`
const SelectBar = styled.div`
    display:flex;
    background-color: ${p=>p.theme.colors.bgColor};
    border-radius: 10px;
    height:2em;
    overflow:hidden;
    margin:10px !important;
`
const SelectBox = styled.div<{selected:boolean}>`
    flex:1;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    margin:0 !important;
    border-radius:0 !important;
    background-color:${p=>p.selected ? `${p.theme.colors.signatureBlue} !important`:`${p.theme.colors.bgColor} !important`};
    cursor:pointer;
`

type Signal = {
    coin:string;
    id:number;
    localDateTime:string;
    long_short:string;
    min:number;
    num:string;
}
const options = [
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
    "SOLUSDT",
    "DOTUSDT",
    "LTCUSDT",
    "TRXUSDT",
    "AVAXUSDT",
    "LINKUSDT",
    "UNIUSDT",
    "ATOMUSDT",
    "ETCUSDT",
    "XMRUSDT",
    "XLMUSDT",
    "BCHUSDT",
    "FILUSDT",
    "LDOUSDT",
    "APTUSDT",
    "VETUSDT",
    "NEARUSDT",
    "ALGOUSDT",
    "APEUSDT",
    "ARBUSDT",
    "ICPUSDT",
    "QNTUSDT",
    "EOSUSDT",
    "GRTUSDT",
    "FTMUSDT",
    "STXUSDT",
    "MANAUSDT",
    "AAVEUSDT",
    "THETAUSDT",
    "XTZUSDT",
    "AXSUSDT",
    "SANDUSDT",
]
export default function Signal({

                               }) {
    const {curPair, setCurPair} = useStore();

    const [mode, setMode] = useState<0|1|2|3>(0);

    const { data, error } = useSWR<Signal[]>("/webhook/get/signal",getSignal,);
    const [finalData, setFinalData] = useState<Signal[]>([]);
    useEffect(()=>{
        if(data) {
            setFinalData(data
                .filter(
                    // @ts-ignore
                    v => v.cryptoName.replace(".P","") == curPair
                ).
                sort(
                (a,b) => new Date(b.localDateTime).getTime() - new Date(a.localDateTime).getTime()
            )
            );
        }
    },[data, curPair])
    const columns = useMemo(
        () => [
          {
            Header: 'Position',
            accessor: 'side',
            Cell: ({value, row}) => (
                    <PositionColor isShort={value == "sell"}>
                        {value.toUpperCase()}
                    </PositionColor>
            )
          },
          {
            Header: 'Price',
            accessor: 'closePrice',
          },
          {
            Header: 'Time',
            accessor: 'localDateTime',
              sortType: 'datetime',
            Cell: ({value, row}) => {
                const date = new Date(value);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hour = date.getHours();
                const min = date.getMinutes();
                return `${year}-${month}-${day} ${hour}:${min}`
            }
          },
          {
            Header: 'Profit',
            accessor: 'profit',
          },
        ],
        []
      )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
  } = useTable({ columns, data:finalData??[] })
    const onSelect = e => {
        setCurPair(e.value)
    }
    return <Adjust>
            <OptionBlock>
                <Dropdown options={options} onChange={onSelect} value={curPair}/>
                <SelectBar>
                    <SelectBox onClick={()=>setMode(0)} selected={mode === 0}>
                        5M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(1)} selected={mode === 1}>
                        15M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(2)} selected={mode === 2}>
                        30M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(3)} selected={mode === 2}>
                        1H
                    </SelectBox>
                </SelectBar>
            </OptionBlock>
            <BubbleBox>
                <PayBtn>현재 시그널 보기</PayBtn>
                <PrettyTable {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup=>(
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column=>(
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}

                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows
                            ?.map((row,index)=>{
                            if(index == 0 || index == 1) {
                                return(
                                    <tr role={"row"}>
                                        <td role={"cell"}>-</td>
                                        <td role={"cell"}>-</td>
                                        <td role={"cell"}>-</td>
                                    </tr>
                                )
                            }
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells
                                        .map((cell, i)=> {

                                        return (
                                            <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}

                                          </td>
                                        )
                                    })}

                                </tr>
                            )
                        })}

                    </tbody>
                </PrettyTable>
            </BubbleBox>
    </Adjust>
}
