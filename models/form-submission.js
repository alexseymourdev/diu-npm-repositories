const BaseModel = require("./base/dynamo-db");
class FormSubmissionModel extends BaseModel {
    tableName = "form_submissions";

    update(id, item, callback) {
        const params = {
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: "set #data.approved = :approved",
            ExpressionAttributeNames: {
                "#data": "data",
            },
            ExpressionAttributeValues: {
                ":approved": item.approved,
            },
            ReturnValues: "ALL_NEW",
        };
        // @ts-ignore
        this.documentClient.update(params, (error, data) => {
            callback(error, data.Attributes || null);
        });
    }

    get(params, callback) {
        const query = {
            TableName: this.tableName,
        };

        // Get by page
        if (params.pageKey) {
            query.ExclusiveStartKey = {
                id: params.pageKey,
            };
        }

        // Filter by type
        if (params.type) {
            query.FilterExpression = "#type = :type";
            query.ExpressionAttributeNames = {
                "#type": "type",
            };
            query.ExpressionAttributeValues = {
                ":type": params.type,
            };
        }

        // Run query
        this.documentClient.scan(query, callback);
    }

    getById(id, callback) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames: {
                "#id": "id",
            },
            ExpressionAttributeValues: {
                ":id": id,
            },
        };
        this.documentClient.query(params, callback);
    }
}

module.exports = FormSubmissionModel;
