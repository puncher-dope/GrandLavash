export const isValidImageUrl = (url: string | undefined):boolean => {
    if(!url || url?.trim() === '') return false

    try{
        new URL(url)
        return true
    }catch(e){
        return e ? false : true
    }
}