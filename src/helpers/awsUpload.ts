// AWS S3 Service
import { S3 } from "aws-sdk"
import { v4 as uuid } from 'uuid'

const uploadImageToS3 = async(dataURL: string): Promise<S3.ManagedUpload.SendData> => {
    const dataBuffer = Buffer.from(dataURL.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    const dataType = dataURL.split(';')[0].split('/')[1]
    if(!['jpg', 'jpeg', 'png'].includes(dataType)) return undefined

    const s3 = new S3({
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    })

    const uploadResult = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Body: dataBuffer,
        Key: `${uuid()}.${dataType}`,
    }).promise()
    
    return uploadResult
}
export default uploadImageToS3