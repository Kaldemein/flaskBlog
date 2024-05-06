import datetime
from functools import wraps
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from config import DB_URL, TOKEN_SECRET_KEY
from marshmallow import Schema, fields, validate, ValidationError
from flask_jwt_extended import JWTManager, create_access_token
import jwt
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)
jwt_manager = JWTManager(app)
CORS(app)



#SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#JSON Web Token
app.config['JWT_SECRET_KEY'] = TOKEN_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)  # Пример установки срока действия токена на 1 час


db = SQLAlchemy(app) # db intitialized here
ma = Marshmallow(app) #marshballow object

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username')


class Articles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    body = db.Column(db.Text())
    datetime = db.Column(db.DateTime, default=datetime.datetime.now)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', backref=db.backref('articles', lazy=True))
    def __init__(self, title, body, user_id):
        self.title = title
        self.body = body
        self.author_id = user_id
        self.author_name = User.query.get(user_id).username  # Получаем имя пользователя по его id

class ArticlesSchema(ma.Schema):
    author = ma.Nested(UserSchema)
    class Meta:
        fields = ('id', 'title', 'body', 'datetime', 'author')
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    body = fields.Str(required=True)
    datetime = fields.DateTime(dump_only=True)
    author_id = fields.Int()
    author_name = fields.Str()
        
article_schema = ArticlesSchema()        
articles_schema = ArticlesSchema(many=True)
user_schema = UserSchema()



def authenticate():
    #достаем токен из заголовка
    token = request.headers.get('Authorization')

    #если токена нет в заголовках
    if not token: 
        return False, 'No token provided'

    try:
        #пробуем докодировать токен
        decoded_token = jwt.decode(token, TOKEN_SECRET_KEY, algorithms=['HS256'])

        #достаем user id из payload токена
        user_id = decoded_token.get('id')
        if not user_id:
            return False, "No user id in token's payload"

        #ищем есть ли такой юзер в БД
        user = User.query.get(user_id)

        if not user:
            return False, "User not found"


        return user, "User authenticated successfully"
    except jwt.exceptions.ExpiredSignatureError:
        return False, "Expired token"
    except jwt.exceptions.InvalidTokenError:
        return False, "Invalid token"
    except Exception as e:
        return False, str(e)
    
def authoirize(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        user, message = authenticate()
        if not user: 
            return jsonify({'message': message}), 401
        return func(user, *args, **kwargs)
    return decorated_func



#REST
@app.route('/register', methods=['POST'])
def register():
    json_data = request.json
    username = json_data.get('username')
    password = json_data.get('password')
    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    json_data = request.json
    username = json_data.get('username')
    password = json_data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401
    additional_claims = {'id': user.id}
    access_token = create_access_token(identity=user.username, additional_claims=additional_claims)
    return jsonify(access_token=access_token), 200


@app.route('/get', methods=['GET'])
def get_articles():
    articles_all = Articles.query.all() #список объектов 
    return articles_schema.jsonify(articles_all) #список превращаем в Json


@app.route('/get/<id>/', methods=['GET'])
def get_article(id):
    articles = Articles.query.get(id) #Объект
    
    return article_schema.jsonify(articles) #объект в Json

@app.route('/create', methods=['POST'])
@authoirize
def create_articles(user):
    json_data = request.json
    try:
        data = article_schema.load(json_data) #пытается десериализовать и валидировать данные из json_data с использованием схемы.
        title = data['title']
        body = data['body']
        article = Articles(title, body, user.id)
        db.session.add(article)
        db.session.commit()
        # Сериализация и отправка ответа
        return article_schema.jsonify(article), 201
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
        


@app.route('/update/<id>/', methods=['PUT'])
@authoirize
def update_article(user,id):
    json_data = request.json
    try:
        data = article_schema.load(json_data)
        
        article = Articles.query.get(id)
        if not article:
            return {'message': 'Article not found'}, 404
        
            # Проверяем, является ли пользователь автором статьи
        if article.author_id != user.id:
            return jsonify({"message": "You are not authorized to update this article"}), 403

        
        article.title = data['title']
        article.body = data['body']
        
        db.session.commit()
        return article_schema.jsonify(article), 200
    
    except ValidationError as err:
        return jsonify({"message": err.messages}), 400


@app.route('/delete/<id>/', methods=['DELETE'])
@authoirize
def delete_article(user,id):
    article = Articles.query.get(id)
    if article.author_id != user.id:
        return jsonify({"message": "You are not authorized to delete this article"}), 403

    
    db.session.delete(article)
    db.session.commit()
    return article_schema.jsonify(article)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True)
