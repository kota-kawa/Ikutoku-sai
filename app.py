import os
from flask import Flask, render_template, redirect, session, request, url_for, flash
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

# セッション用シークレットキーを .env から設定
app.secret_key = os.environ.get('SECRET_KEY')

# 管理者パスワード
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

# ログインページ
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        pw = request.form.get('password', '')
        if pw == ADMIN_PASSWORD:
            session['admin_logged_in'] = True
            return redirect(url_for('bingo'))
        else:
            flash('パスワードが正しくありません。', 'error')
    return render_template('login.html')

# ログアウト
@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('login'))

# ビンゴページ（管理者のみ）
@app.route('/bingo')
def bingo():
    if not session.get('admin_logged_in'):
        return redirect(url_for('login'))
    return render_template('bingo.html')

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
