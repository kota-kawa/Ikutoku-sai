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
@app.route('/login', methods=['GET'])
def login():
    # 既にログイン済みなら bingo へリダイレクト
    if session.get('admin_logged_in'):
        return redirect(url_for('bingo'))
    return render_template('login.html')


# 認証処理専用（POST）
@app.route('/login_submit', methods=['POST'])
def login_submit():
    pw = request.form.get('password', '')
    if pw == ADMIN_PASSWORD:
        session['admin_logged_in'] = True
        session.permanent = True  # 必要ならセッションを永続化
        return redirect(url_for('bingo'))
    else:
        flash('パスワードが違います', 'error')
        return redirect(url_for('login'))

#ビンゴページ（運営のみ）
@app.route('/bingo')
def bingo():
    # 未ログインなら login へ戻す
    if not session.get('admin_logged_in'):
        return redirect('/login')
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
