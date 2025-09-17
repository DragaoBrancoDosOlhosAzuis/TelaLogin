from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from tinydb import TinyDB, Query
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'  # Mude para uma chave segura em produção

# Configuração do banco de dados
db = TinyDB('database.json')
users_table = db.table('users')

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    User = Query()
    user = users_table.get(User.username == username)
    
    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'success': True, 'message': 'Login realizado com sucesso!'})
    else:
        return jsonify({'success': False, 'message': 'Usuário ou senha inválidos'})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    if password != confirm_password:
        return jsonify({'success': False, 'message': 'As senhas não coincidem'})
    
    User = Query()
    if users_table.get(User.username == username):
        return jsonify({'success': False, 'message': 'Usuário já existe'})
    
    hashed_password = generate_password_hash(password)
    user_id = len(users_table) + 1
    
    users_table.insert({
        'id': user_id,
        'username': username,
        'password': hashed_password
    })
    
    return jsonify({'success': True, 'message': 'Usuário criado com sucesso!'})

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return f'<h1>Bem-vindo, {session["username"]}!</h1><a href="/logout">Sair</a>'

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Criar usuário padrão se não existir
    User = Query()
    if not users_table.get(User.username == 'admin'):
        users_table.insert({
            'id': 1,
            'username': 'admin',
            'password': generate_password_hash('admin123')
        })
    
    app.run(debug=True)