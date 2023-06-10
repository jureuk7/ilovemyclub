import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import {
    Column,
    Table,
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
  } from '@tanstack/react-table';
import { makeData, Person } from "utils/makeData";
import Switch from "@/components/switch";
import { toast } from "react-toastify";
import useSWR from "swr";

const Container = styled.div`

    overflow-y:auto;
    width:100%;
    height:100%;
    padding:20px;
    padding-bottom:50px;
    display:flex;  
    gap:10px;
    justify-content: center;
    div {
        border-radius:20px;
    }


`
const Main = styled.div`

    flex:0.9;

    display:flex;
    flex-direction:column;
`
const Sidebar = styled.div`
    flex:0.1;
    
    height:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    overflow-x:hidden;
    
`
const SidebarOption = styled.div<{activated:boolean}>`

    height:2em;
    display:flex;
    justify-content: center;
    align-items:center;
    border-radius:0px !important;
    background-color: ${p=>p.activated ? p.theme.colors.signatureBlue : p.theme.colors.blockColor};
    cursor:pointer;
    &:hover {
        background-color: ${p=>p.theme.colors.invertColor};
        transition: 0.3s ease;
    }
`
const IndexContainer=styled.div`
    display:flex;
    flex-direction:column;
    background-color: ${p=>p.theme.colors.blockColor};
`
const BubbleBox = styled.div`
    padding:10px;
    background-color: ${p=>p.theme.colors.blockColor};

`
const PrettyButton = styled.button`
    width:auto;
    height:2em;
    border-radius: 0.2em;
    background-color: ${p=>p.theme.colors.signatureBlue};
    border:none;
    border-radius: 1em;
    display: flex;
    padding:5px;
    justify-content: center;
    align-items: center;
    cursor:pointer;
`
const Searchbar = styled.div`
    width:100%;
    height:2em;
    display:flex;
    gap:0.4em;
    input {
        flex:1;
        border:none;
        border-radius: 15px;
    }
`
const SubmitBtn = styled.div`
    width:4em;
    height:2em;
    background-color: ${p=>p.theme.colors.pointColor1};
    border-radius:5px;
    display:flex;
    align-items: center;
    justify-content: center;
`
const PrettyTable = styled.table`
    width:100%;
    height:auto;

    border-collapse: collapse;
    border-radius:10px;
    box-shadow: 0 0 0 2px #fff;
    thead > tr {
        border-bottom: 2px solid ${p=>p.theme.colors.invertColor};

    }
    td {
            text-align:center;
    }
    input {
        width:100%;
        max-height:2em;
        border-radius: 15px;
        border:none;
        background:${p=>p.theme.colors.bgColor};

        padding-left:15px;
    }
    input[type=number]::-webkit-inner-spin-button {
    }


`

const MiniInput = styled.input`
    min-width:10em;
    width:auto;
    height:2em;
    margin:10px;
    border-radius: 15px;
    border:none;
    background:${p=>p.theme.colors.bgColor};
    box-sizing:border-box;
    padding-left:15px;

    &::-webkit-inner-spin-button {
        display: none;
    }
`
const EditBtn = styled.div`

    height:1em;
    background-color: ${p=>p.theme.colors.signatureRed};
    justify-content: center;
    align-items: center;
    display:flex;
    border-radius: 5px !important;
`

const ButtonPlate = styled.div`
    display:flex;
    justify-content:center;
    align-items: center;
    gap:0.5rem;
    
`
const PrettySpan = styled.span`
    display:flex;
    justify-content: center;
    align-items: center;
    gap:1em;
`
const PrettySelect = styled.select`
    background-color: ${p=>p.theme.colors.bgColor};
    border:none;
    border-radius: 1em;
    padding:5px;
    option {
        border:none;
    }
    
`

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
      updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}
  
  // Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
    cell: ({ getValue, row: { index,original }, column: { id }, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        toast.info(<div><div>{original.name}의 정보를 수정함</div><br/><div>id: {original.id}</div><br/><div><>{id}의 값을</><br/><>{value}으로 설정함</></div></div>, {position:toast.POSITION.TOP_RIGHT});
        table.options.meta?.updateData(index, id, value)
      }
  
      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
  
      return (
        <input
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )
    },
  }
  
function useSkipper() {
    const shouldSkipRef = useRef(true)
    const shouldSkip = shouldSkipRef.current
  
    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
      shouldSkipRef.current = false
    }, [])
  
    useEffect(() => {
      shouldSkipRef.current = true
    })
  
    return [shouldSkip, skip] as const
  }
  

const Index = () => {

    const rerender = useReducer(() => ({}), {})[1]

    const columns = useMemo<ColumnDef<Person>[]>(
      () => [
        {
          header: 'Name',
          accessorKey:'name',
          footer: props => props.column.id,
          
        },
        {
          header: 'Password',
          accessorKey:'password',
          footer: props => props.column.id,
        },
        {
            header: 'Points',
            accessorKey:'points',
            footer: props => props.column.id,
        },
      ],
      []
    )


    const {data, error, mutate} = useSWR(`http://49.247.43.169:8080/get/user/all`)
  
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
          updateData: (rowIndex, columnId, value) => {
            // Skip page index reset until after next rerender
            skipAutoResetPageIndex()
            // setData(old =>
            //   old.map((row, index) => {
            //     console.log(old)
            //     if (index === rowIndex) {
            //       return {
            //         ...old[rowIndex]!,
            //         [columnId]: value,
            //       }
            //     }
            //     return row
            //   })
            // )
          },
        },
        debugTable: false,
      })


      return (
        <>
            <BubbleBox>
              {data&&<>
              <PrettyTable>
                
                  <thead>
                  {table?.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                          return (
                          <th key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder ? null : (
                              <div>
                                  {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                  )}
                                  {header.column.getCanFilter() ? (
                                  <div>
                                      <Filter column={header.column} table={table} />
                                  </div>
                                  ) : null}
                              </div>
                              )}
                          </th>
                          )
                      })}
                      </tr>
                  ))}
                  </thead>
                  <tbody>
                  {table?.getRowModel().rows.map(row => {
                      return (
                      <tr key={row.id}>
                          {row.getVisibleCells().map(cell => {
                          return (
                              <td key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                              )}
                              </td>
                          )
                          })}
                      </tr>
                      )
                  })}
                  </tbody>
              </PrettyTable>
              <ButtonPlate>
                  <PrettyButton
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  >
                  {'<<'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  >
                  {'<'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  >
                  {'>'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  >
                  {'>>'}
                  </PrettyButton>
                  <PrettySpan>
                  <div>Page</div>
                  <strong>
                      {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                  </strong>
                  </PrettySpan>
                  <PrettySpan>
                  | Go to page:
                  <MiniInput
                      type="number"
                      min={0}
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                  
                      }}
                  />
                  </PrettySpan>
                  <PrettySelect
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                      table.setPageSize(Number(e.target.value))
                  }}
                  >
                  {[10, 20, 30].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                      </option>
                  ))}
                  </PrettySelect>
              </ButtonPlate>
              <ButtonPlate>
                  <div>{table.getRowModel().rows.length} Rows</div>
                  <div>
                      <PrettyButton onClick={() => rerender()}>Force Rerender</PrettyButton>
                  </div>
                  <div>
                      <PrettyButton onClick={() => mutate()}>Refresh Data</PrettyButton>
                  </div>            
              </ButtonPlate>              
              </>}

            </BubbleBox>     
 
        </>

      )
}
const Options = () => {
    const [on, setOn] = useState<boolean>(false);
    return <>
        options
        <Switch state={on} setfunc={setOn}/>
    </>
}
function Filter({
    column,
    table,
  }: {
    column: Column<any, any>
    table: Table<any>
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)
  
    const columnFilterValue = column.getFilterValue()
  
    return typeof firstValue === 'number' ? (
      <div style={{display:"flex", gap:"5px"}}>
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
        />
      </div>
    ) : (
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
      />
    )
  }

Admin.navbar = false;
export default function Admin() {
    
    

    const [mode, setMode] = useState<boolean[]>([true, false, false]);
    const lastIndex = useRef<number>(0);
    const curpage = useRef<JSX.Element>(<Index/>); // 로직상으로 ref로 설정해도 setMode로 인해서 업데이트가 필연적임
    const curpageName = useRef<string>('Dashboard');
    const Select = i => {
        const newArray = [...mode];
        newArray[lastIndex.current] = false;
        newArray[i] = true;
        lastIndex.current = i;
        setMode(newArray);
    }


    return <>
        <Container>
            <Sidebar>
                <SidebarOption activated={mode[0]} onClick={()=>{curpage.current=<Index/>;curpageName.current = "DashBoard"; Select(0)}}>
                    Dashboard
                </SidebarOption>
                <SidebarOption activated={mode[1]} onClick={()=>{curpage.current=<Options/>;curpageName.current = "Config";Select(1)}}>
                    Config
                </SidebarOption>
            </Sidebar>
            <Main>
                <PageTitle>
                    {curpageName.current}
                </PageTitle>

                {curpage.current}

            </Main>
        </Container>
    </>
}

const PageTitle = styled.div`
    padding:10px;
    font-size:4em;
`