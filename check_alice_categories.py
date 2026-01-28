#!/usr/bin/env python3
"""Check Alice's categories"""
import sys
sys.path.insert(0, '/Users/basestation/Documents/Palstacks/finPal/finpal-backend')

from src.extensions import db
from src.models.user import User
from src.models.category import Category
from src import create_app

app = create_app()

with app.app_context():
    # Find Alice (id is the email)
    alice = User.query.get('alice@example.com')
    
    if not alice:
        print("Alice not found")
        all_users = User.query.all()
        user_ids = [u.id for u in all_users]
        print(f"Available users: {user_ids}")
        sys.exit(1)
    
    print(f"Alice ID: {alice.id}")
    
    # Get all categories
    categories = Category.query.filter_by(user_id=alice.id, parent_id=None).all()
    print(f"\nTotal parent categories: {len(categories)}")
    
    for cat in categories:
        subcats = Category.query.filter_by(parent_id=cat.id).all()
        print(f"  {cat.name} ({cat.icon}): {len(subcats)} subcategories")
        for sub in subcats[:3]:  # Show first 3
            print(f"    - {sub.name}")
        if len(subcats) > 3:
            print(f"    ... and {len(subcats) - 3} more")
