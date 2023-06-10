import {create} from 'zustand'
interface serviceI {
    themeMode:boolean;
    setThemeMode: (value:boolean) => void;
    toggleTheme:()=>void;
    isLogined:boolean;
    setIsLogined: (value:boolean) => void;
    curPair:string;
    setCurPair: (value:string) => void;
}
const useStore = create<serviceI>(set=>({
    themeMode:true,
    isLogined:false,
    curPair:"BTCUSDT",
    setIsLogined:(value:boolean)=>set(()=>({isLogined:value})),
    setThemeMode:(value:boolean)=>set(()=>({themeMode:value})),
    setCurPair:(value:string)=>set(()=>({curPair:value})),
    toggleTheme: () => set(state=>({themeMode:!state.themeMode}))
}))

export default useStore;
