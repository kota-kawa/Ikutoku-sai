from flask import  render_template, redirect, session, request, Flask, url_for, jsonify

app = Flask(__name__)



@app.route('/bingo')
def bingo():
    return render_template('bingo.html')

@app.route('/api/action', methods=['POST'])
def action():
    data = request.json
    gesture = data.get('gesture')
    if gesture == 'click':
        # クリック処理をここに実装
        return jsonify({'status': 'clicked'})
    elif gesture == 'scroll_up':
        # スクロール処理をここに実装
        return jsonify({'status': 'scrolled_up'})
    # 他のジェスチャー処理
    return jsonify({'status': 'unknown'}), 400


@app.route('/')
def index():
    return render_template('index.html')

#デザイン画面
@app.route('/announce')
def announce():
    return render_template('announce.html')

@app.route('/event')
def event():
    return render_template('event.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/map')
def map():
    return render_template('map.html')

#アプリの実行する
if __name__ == '__main__':
    app.run(debug=True)
