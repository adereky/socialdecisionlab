import json, os, binascii, platform, zipfile
from datetime import datetime
from io import BytesIO
from flask import Flask, send_from_directory, request, render_template, send_file
from flask_basicauth import BasicAuth
import pandas as pd

app  = Flask(__name__)

if platform.system().lower() == 'linux':
    app.config['BASIC_AUTH_USERNAME'] = os.environ['SDL_AUTH_USER']
    app.config['BASIC_AUTH_PASSWORD'] = os.environ['SDL_AUTH_PWD']
else:
    app.config['BASIC_AUTH_USERNAME'] = 'test'
    app.config['BASIC_AUTH_PASSWORD'] = 'test'

basic_auth = BasicAuth(app)

@app.route('/',methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/save',methods=['POST'])
def save():
    timestr = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    post = json.loads(request.get_data())
    fileName = post.get('fileName')
    jsonStrings = post.get('dataAsJSON')
    csvStrings = post.get('csvStrings')
    folder = post.get('folder','')
    for dir in ['data/json/','data/csv/'+folder]:
        if not os.path.isdir(dir):
            os.makedirs(dir)
    for i,string in enumerate(jsonStrings):
        with open(os.path.join('data','json',timestr+'_'+fileName+'_'+str(i)+'.json'),'w') as f:
            f.write(string)
    for i,string in enumerate(csvStrings):
        with open(os.path.join('data','csv',folder,timestr+'_'+fileName+'_'+str(i)+'.csv'),'w') as f:
            f.write(string)
    return json.dumps({'success':True})

@app.route('/download/',methods=['GET'])
def render_home():
    return render_download('')

@app.route('/download/<path:path>',methods=['GET'])
@basic_auth.required
def render_download(path):
    homepath = os.path.join('data','csv')
    contents = [os.path.join(path,i) for i in os.listdir(os.path.join(homepath,path)) if i[0]!='.']
    files = [i for i in contents if os.path.isfile(os.path.join(homepath,i))]
    files.sort()
    folders = [i for i in contents if not os.path.isfile(os.path.join(homepath,i))]
    return render_template('download.html',folders=folders,files=files,dir=path)

@app.route('/file/<path:path>',methods=['GET'])
@basic_auth.required
def send_single_file(path):
    return send_file(os.path.join('data','csv',path),as_attachment=True)

@app.route('/zipped/',methods=['GET'])
@app.route('/zipped/<path:path>',methods=['GET'])
@basic_auth.required
def send_zipped_dir(path=''):
    dir = os.path.join('data','csv',path)
    zipf = BytesIO()
    zipo = zipfile.ZipFile(zipf,'w', zipfile.ZIP_DEFLATED)
    for root, dirs, files in os.walk(dir):
        for file in files:
            zipo.write(os.path.join(root, file))
    zipo.close()
    zipf.seek(0)
    return send_file(zipf,as_attachment=True,attachment_filename='SDL_downloads.zip')

@app.route('/ip-address',methods=['GET'])
def get_ip():
    return request.remote_addr

@app.route('/payout',methods=['GET'])
def send_payout():
    # if not request.args.get('dev'):
    #     return render_template('payout.html',state='not calculated')
    folder = request.args.get('f')
    uid = request.args.get('i')
    if not folder or not uid:
        return render_template('payout.html',state='invalid')
    if not os.path.exists(os.path.join('data','csv',folder)):
        return render_template('payout.html',state='nofolder')
    sessionFiles = [os.path.join('data','csv',folder,i) for i in os.listdir(os.path.join('data','csv',folder)) if uid in i and i[-6:]=='_1.csv']
    if len(sessionFiles)<7:
        return render_template('payout.html',state='incomplete')
    sessionData = pd.concat([pd.read_csv(i) for i in sessionFiles])
    sessionData['randPayoffS'] = sessionData.randPayoffS1_CHF+sessionData.randPayoffS2_CHF
    sessionData['randPayoffC'] = sessionData.randPayoffC1_CHF+sessionData.randPayoffC2_CHF
    sessionData['randPayoffN'] = 2 - sessionData[['randPayoff1_IDX','randPayoff2_IDX']].isnull().sum(axis=1)
    part1rowSel = (sessionData.sessionID <= 3) | (sessionData.sessionID==7)
    part2rowSel = (sessionData.sessionID == 4) | (sessionData.sessionID == 5)
    kwargs = {
        'uid': uid,
        'part1Self': ( sessionData.loc[part1rowSel,'randPayoffS'].sum() / sessionData.loc[part1rowSel,'randPayoffN'].sum() ).round().astype(int),
        'part1Charity': ( sessionData.loc[part1rowSel,'randPayoffC'].sum() / sessionData.loc[part1rowSel,'randPayoffN'].sum() ).round().astype(int),
        'part2Self': sessionData.loc[part2rowSel,'randPayoffS'].sum().round().astype(int),
        'part2Charity': sessionData.loc[part2rowSel,'randPayoffC'].sum().round().astype(int),
        'selectedCharity': sessionData.loc[sessionData.sessionID==1,'charity'].values[0],
        'conversionRate': sessionData.loc[sessionData.sessionID==1,'conversionRate'].values[0],
        'timestamp' : str(pd.Timestamp.now())
    }
    kwargs['finalSelf'] = kwargs['part1Self']+kwargs['part2Self']
    kwargs['finalCharity'] = kwargs['part1Charity']+kwargs['part2Charity']
    kwargsDF = pd.DataFrame(kwargs,index=[0])
    payoutTable = os.path.join('data','csv',folder,'payoutDisplay.csv')
    if os.path.isfile(payoutTable):
        kwargsDF.to_csv(payoutTable,mode='a',header=False,index=False)
    else:
        kwargsDF.to_csv(payoutTable,index=False)
    return render_template('payout.html',**kwargs)


@app.route('/<path:path>',methods=['GET'])
def send_public(path):
    return send_from_directory('public', path)

if __name__=="__main__":
    app.run(debug=True,port=5000)
