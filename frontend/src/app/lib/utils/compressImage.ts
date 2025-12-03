export const compressImage = (file: File, quality:number=0.8): Promise<string> => {
    return new Promise((res, rej) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            const MAX_WIDTH = 800
            const MAX_HEIGHT = 800

            let {width, height} = img

            if(width > height){
                if(width > MAX_WIDTH){
                    height *= MAX_WIDTH/width
                }
            }else{
                if(height > MAX_HEIGHT){
                    width *= MAX_HEIGHT/height
                    height = MAX_HEIGHT
                }
            }

            canvas.width = width
            canvas.height = height

            ctx?.drawImage(img, 0, 0, width, height)

            const base64 = canvas.toDataURL('image/jpeg', quality)
            res(base64)
        }

        img.onerror = rej
        img.src = URL.createObjectURL(file)
    })
}