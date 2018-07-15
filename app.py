import json, os, binascii, platform
from datetime import datetime
from flask import Flask, send_from_directory, request
from flask_basicauth import BasicAuth

app  = Flask(__name__)

if platform.system() == 'linux':
    app.config['BASIC_AUTH_USERNAME'] = os.environ['SDL_AUTH_USER']
    app.config['BASIC_AUTH_PASSWORD'] = os.environ['SDL_AUTH_PWD']
else:
    app.config['BASIC_AUTH_USERNAME'] = 'test'
    app.config['BASIC_AUTH_PASSWORD'] = 'test'

basic_auth = BasicAuth(app)

@app.route('/save',methods=['POST'])
def save():
    timestr = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    unique_id = binascii.hexlify(os.urandom(16))
    post = json.loads(request.get_data())
    jsonStrings = post.get('dataAsJSON')
    csvStrings = post.get('csvStrings')
    for folder in ['data/json/','data/csv/']:
        if not os.path.isdir(folder):
            os.makedirs(folder)
    for i,string in enumerate(jsonStrings):
        with open(os.path.join('data','json',timestr+'_'+unique_id+'_'+str(i)+'.json'),'w') as f:
            f.write(string)
    for i,string in enumerate(jsonStrings):
        with open(os.path.join('data','csv',timestr+'_'+unique_id+'_'+str(i)+'.json'),'w') as f:
            f.write(string)
    return json.dumps({'success':True})

@app.route('/download',methods=['GET'])
@basic_auth.required
def downloads():
    return json.dumps({"success":True})

@app.route('/ip-address',methods=['GET'])
def get_ip():
    return request.remote_addr

@app.route('/appendNotfiJob',methods=['POST'])
def append_notif():
    post = json.loads(request.data)
    with open('notifications.txt','a') as f:
        f.write(post['notifJob'])
    return json.dumps({'success':True})

@app.route('/<path:path>',methods=['GET'])
def send_public(path):
    return send_from_directory('public', path)

if __name__=="__main__":
    app.run(debug=True,port=5000)
