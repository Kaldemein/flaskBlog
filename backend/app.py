import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from config import DB_URL

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app) # db intitialized here
ma = Marshmallow(app) #marshballow object



class Articles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    body = db.Column(db.Text())
    datetime = db.Column(db.DateTime, default=datetime.datetime.now)
    
    def __init__(self, title, body):
        self.title = title
        self.body = body
    
class ArticlesSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'body', 'datetime')
        
article_schema = ArticlesSchema()        
articles_schema = ArticlesSchema(many=True)
  



#REST
@app.route('/get', methods=['GET'])
def get_articles():
    articles_all = Articles.query.all() #список объектов
    return articles_schema.jsonify(articles_all) #список превращаем в Json


@app.route('/get/<id>/', methods=['GET'])
def get_article(id):
    articles = Articles.query.get(id) #Объект
    return article_schema.jsonify(articles) #объект в Json

@app.route('/create', methods=['POST'])
def create_articles():
    title = request.json['title']
    body = request.json['body']
    article = Articles(title, body)
    db.session.add(article)
    db.session.commit()
    return article_schema.jsonify(article)

@app.route('/update/<id>/', methods=['PUT'])
def update_article(id):
    article = Articles.query.get(id)
    
    title = request.json['title']
    body = request.json['body']
    
    article.title = title
    article.body = body
    
    db.session.commit()
    return article_schema.jsonify(article)

@app.route('/delete/<id>/', methods=['DELETE'])
def delete_article(id):
    article = Articles.query.get(id)
    
    db.session.delete(article)
    db.session.commit()
    return article_schema.jsonify(article)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True)
