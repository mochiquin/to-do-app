from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)  # 允许前端跨域访问

# 数据模型定义
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat()
        }

# 测试根路由
@app.route('/')
def home():
    return jsonify({'message': 'Todo API is running!', 'status': 'ok'})

# API 路由
@app.route('/api/todos', methods=['GET'])
def get_todos():
    """获取所有待办事项"""
    print("收到 GET /api/todos 请求")  # 调试信息
    todos = Todo.query.order_by(Todo.created_at.desc()).all()
    return jsonify([todo.to_dict() for todo in todos])

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """创建新的待办事项"""
    print("收到 POST /api/todos 请求")  # 调试信息
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'error': '标题不能为空'}), 400
    
    new_todo = Todo(
        title=data['title'],
        description=data.get('description', '')
    )
    
    db.session.add(new_todo)
    db.session.commit()
    
    return jsonify(new_todo.to_dict()), 201

@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """获取单个待办事项"""
    print(f"收到 GET /api/todos/{todo_id} 请求")
    todo = Todo.query.get_or_404(todo_id)
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """更新待办事项"""
    print(f"收到 PUT /api/todos/{todo_id} 请求")
    todo = Todo.query.get_or_404(todo_id)
    data = request.get_json()
    
    todo.title = data.get('title', todo.title)
    todo.description = data.get('description', todo.description)
    todo.completed = data.get('completed', todo.completed)
    
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """删除待办事项"""
    print(f"收到 DELETE /api/todos/{todo_id} 请求")
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return '', 204

# 调试路由 - 显示所有可用路由
@app.route('/api/routes')
def list_routes():
    """显示所有可用的路由"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'url': str(rule)
        })
    return jsonify(routes)

# 确保数据库表始终存在（无论何种启动方式）
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)