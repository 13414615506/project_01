import FileSaver from 'file-saver';
import * as  XLSX from 'xlsx';




export const exportExcel=(name: any,tableName: any)=>{
    let sel=XLSX.utils.table_to_book(document.querySelector(tableName))
    let selIn=XLSX.write(sel,{bookType:'xlsx',bookSST:true,type:'array'})

    try{
        FileSaver.saveAs(new Blob([selIn],{type:'application/octet-stream'}),name);
    }catch(e){
        if(typeof console!=='undefined'){
            console.log(e,selIn);
        }
    }
    return selIn;
}