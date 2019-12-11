export function formateDate(time) {
    if(!time){
        return ''
    }else{
        let date = new Date(time)
        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDay()+8) + '  ' + date.getHours()
        + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
}