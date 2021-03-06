import { DynamoDB } from 'aws-sdk'
import * as uuid from 'uuid'
import * as _ from 'lodash'

const dynamoDb = new DynamoDB.DocumentClient()

export const scanPromise = (TableName, FilterExpression, ExpressionAttributeValues = null, ExpressionAttributeNames = null) => {
    return new Promise((resolve, reject) => {
        let handler = (err, data) => err ? reject(err) : resolve(data.Items),
            params = {TableName, FilterExpression}

        if (ExpressionAttributeNames) params['ExpressionAttributeNames'] = ExpressionAttributeNames
        if (ExpressionAttributeValues) params['ExpressionAttributeValues'] = ExpressionAttributeValues

        dynamoDb.scan(params, handler)
    })
}

export const putPromise = (TableName, Item) => {
    return new Promise((resolve, reject) => {
        dynamoDb.put({TableName, Item}, (err, data) => {
            if (err) reject(err)
            // put won't return the inserted values unless we explicitly retrieve item afterwards
            // so we'll just return what we inserted
            else resolve(Item)
        })
    })
}

export const updatePromise = (TableName, Key, UpdateExpression, ExpressionAttributeValues) => {
    return new Promise((resolve, reject) => {
        dynamoDb.update({
            TableName, Key,
            ExpressionAttributeValues,
            UpdateExpression,
            ReturnValues: "ALL_NEW"
        }, (err, data) => {
            if (err) reject(err)
            else resolve(data.Attributes)
        })
    })

}