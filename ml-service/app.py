from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import json

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ecommerce')
client = MongoClient(MONGO_URI)
db = client['ecommerce']
products_collection = db['products']
interactions_collection = db['interactions']

# Global variables for models
content_model = None
product_data = None
product_features = None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'ml-service',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/train', methods=['POST'])
def train_model():
    """Train the recommendation model"""
    global content_model, product_data, product_features
    
    try:
        # Fetch products
        products = list(products_collection.find({}))
        
        if not products:
            return jsonify({
                'success': False,
                'message': 'No products found in database'
            }), 400
        
        # Create DataFrame
        product_data = pd.DataFrame(products)
        
        # Convert ObjectId to string
        if '_id' in product_data.columns:
            product_data['_id'] = product_data['_id'].astype(str)
        
        # Create text features
        product_data['features'] = (
            product_data['name'].fillna('') + ' ' +
            product_data['description'].fillna('') + ' ' +
            product_data['category'].fillna('')
        )
        
        # TF-IDF Vectorization
        tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
        product_features = tfidf.fit_transform(product_data['features'])
        
        # Create directories
        os.makedirs('models', exist_ok=True)
        os.makedirs('data', exist_ok=True)
        
        # Save model and data
        joblib.dump(tfidf, 'models/tfidf.pkl')
        product_data.to_csv('data/product_data.csv', index=False)
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'products_count': len(product_data)
        })
    except Exception as e:
        print(f"Training error: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    """Get product recommendations"""
    try:
        data = request.json
        product_id = data.get('product_id')
        user_id = data.get('user_id')
        limit = data.get('limit', 6)
        
        recommendations = []
        
        if product_id:
            # Content-based: similar to a specific product
            recommendations = get_similar_products(product_id, limit)
        
        # Default: popular products
        if not recommendations or len(recommendations) == 0:
            recommendations = get_popular_products(limit)
        
        return jsonify({
            'success': True,
            'source': 'model',
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

def load_model():
    """Load saved model"""
    global product_data, product_features
    try:
        tfidf = joblib.load('models/tfidf.pkl')
        product_data = pd.read_csv('data/product_data.csv')
        # Ensure _id is string
        product_data['_id'] = product_data['_id'].astype(str)
        # Recreate features matrix
        features = (
            product_data['name'].fillna('') + ' ' +
            product_data['description'].fillna('') + ' ' +
            product_data['category'].fillna('')
        )
        product_features = tfidf.transform(features)
    except Exception as e:
        raise e

def get_similar_products(product_id, limit=6):
    """Get similar products using content-based filtering"""
    global product_data, product_features
    
    try:
        if product_features is None or product_data is None:
            try:
                load_model()
            except:
                return []
        
        # Find product index
        product_data['_id_str'] = product_data['_id'].astype(str)
        product_idx = product_data[product_data['_id_str'] == str(product_id)].index
        
        if len(product_idx) == 0:
            return []
        
        idx = product_idx[0]
        similarity_scores = cosine_similarity(product_features[idx:idx+1], product_features).flatten()
        similar_indices = similarity_scores.argsort()[::-1][1:limit+1]
        
        similar_products = []
        for i in similar_indices:
            product = products_collection.find_one(
                {'_id': product_data.iloc[i]['_id']},
                {'_id': 1, 'name': 1, 'price': 1, 'category': 1}
            )
            if product:
                product['_id'] = str(product['_id'])
                similar_products.append(product)
        
        return similar_products
    except Exception as e:
        print(f"Error in get_similar_products: {e}")
        return []

def get_popular_products(limit=6):
    """Get popular products based on interactions"""
    try:
        # Aggregate interactions to find popular products
        pipeline = [
            {'$group': {'_id': '$product_id', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': limit}
        ]
        popular = list(interactions_collection.aggregate(pipeline))
        
        recommendations = []
        for p in popular:
            product = products_collection.find_one(
                {'_id': p['_id']},
                {'_id': 1, 'name': 1, 'price': 1, 'category': 1}
            )
            if product:
                product['_id'] = str(product['_id'])
                recommendations.append(product)
        
        return recommendations
    except Exception as e:
        print(f"Error in get_popular_products: {e}")
        return []

@app.route('/track', methods=['POST'])
def track_interaction():
    """Track user interaction for ML"""
    try:
        data = request.json
        interaction = {
            'user_id': data.get('user_id'),
            'product_id': data.get('product_id'),
            'type': data.get('type'),  # view, click, add_to_cart, purchase, rate
            'timestamp': datetime.now(),
            'session_id': data.get('session_id')
        }
        
        # Remove None values
        interaction = {k: v for k, v in interaction.items() if v is not None}
        
        # Save to MongoDB
        result = interactions_collection.insert_one(interaction)
        
        return jsonify({
            'success': True,
            'message': 'Interaction tracked',
            'id': str(result.inserted_id)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get ML service statistics"""
    try:
        total_interactions = interactions_collection.count_documents({})
        total_products = products_collection.count_documents({})
        
        interaction_types = list(interactions_collection.aggregate([
            {'$group': {'_id': '$type', 'count': {'$sum': 1}}}
        ]))
        
        return jsonify({
            'success': True,
            'data': {
                'total_interactions': total_interactions,
                'total_products': total_products,
                'interaction_types': interaction_types
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)