from flask import Flask, request, json, Response
from flask_cors import CORS
from pymongo import MongoClient
# MONGO_URL = "mongodb+srv://new_user_7:q1w2e3r4A6@cluster0.njikoyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_URL = "mongodb://host.docker.internal:5000/"

class MongoAPI:
    def __init__(self, data):
        self.client = MongoClient(MONGO_URL)

        database = 'TodoDB'
        collection = 'todos'
        cursor = self.client[database]
        self.collection = cursor[collection]
        self.data = data
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

    def read(self):
        documents = self.collection.find()
        output = {"todos":[{item: data[item] for item in data if item != '_id'} for data in documents]}
        return output
    
    def write(self, data):
        new_document = data['Document']
        response = self.collection.insert_one(new_document) 
        output = { 'Status': 'Successfully Inserted',
                   'Document_ID': str(response.inserted_id) }
        return output

    def update(self):
        filt = self.data['Filter']
        updated_data = {"$set": self.data['DataToBeUpdated']}
        response = self.collection.update_one(filt, updated_data)
        output = {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}
        return output

    def delete(self, data):
        filt = data['Filter']
        response = self.collection.delete_one(filt)
        output = {'Status': 'Successfully Deleted' if response.deleted_count > 0 else "Document not found."}
        return output

app = Flask(__name__)
CORS(app)

@app.route('/')
def base():
    return Response(response=json.dumps({"Status": "UP"}),
            status=200,
            mimetype='application/json')

@app.route('/mongodb', methods=['GET'])
def mongo_read():
    data = request.json
    obj1 = MongoAPI(data) 
    response = obj1.read()
    return Response(response=json.dumps(response),
            status=200,
            mimetype='application/json')

@app.route('/mongodb', methods=['POST'])
def mongo_write():
    data = json.loads(request.data.decode('utf8'))
    print(data)
    # data = request.json
    if 'Document' not in data:
        return Response(response=json.dumps({"Error": "Please provide document to write."}),
                status=400,
                mimetype='application/json')
    obj1 = MongoAPI(data) 
    response = obj1.write(data) 
    return Response(response=json.dumps(response),
            status=200,
            mimetype='application/json')

@app.route('/mongodb', methods=['PUT'])
def mongo_update():
    data = json.loads(request.data.decode('utf8'))
    print(data)
    if 'Filter' not in data or 'DataToBeUpdated' not in data:
        return Response(response=json.dumps({"Error": "Please provide connection information"}),
                        status=400,
                        mimetype='application/json')
    obj1 = MongoAPI(data)
    response = obj1.update()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

@app.route('/mongodb', methods=['DELETE'])
def mongo_delete():
    data = json.loads(request.data.decode('utf8'))
    # print(jsonObj)
    # data = request.json
    if data is None or data is {} or 'Filter' not in data:
        return Response(response=json.dumps({"Error": "Please provide filter for the Document you would like to delete."}),
                        status=400,
                        mimetype='application/json')
    obj1 = MongoAPI(data)
    response = obj1.delete(data)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')
