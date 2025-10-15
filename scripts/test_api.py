"""
API Test Script for Convergence Platform
Tests all major endpoints to verify functionality.
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8001"

def test_endpoint(method, url, data=None, headers=None):
    """Test an API endpoint and return the result."""
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        else:
            return {"error": f"Unsupported method: {method}"}
        
        return {
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text,
            "url": url
        }
    except Exception as e:
        return {"error": str(e), "url": url}

def run_tests():
    """Run comprehensive API tests."""
    print("🧪 Testing Convergence Platform API")
    print("=" * 50)
    
    tests = [
        # Health checks
        ("GET", "/health", "Health Check"),
        ("GET", "/health/db", "Database Health"),
        
        # Government endpoints
        ("GET", "/api/v1/gov/institutions", "List Institutions"),
        ("GET", "/api/v1/gov/officials", "List Officials"),
        
        # Legal endpoints
        ("GET", "/api/v1/legal/categories", "Legal Categories"),
        ("GET", "/api/v1/legal/laws", "Search Laws"),
        ("GET", "/api/v1/legal/laws?q=tax", "Search Laws (Tax)"),
        
        # AI endpoints
        ("GET", "/api/v1/ai/providers", "AI Providers"),
        ("GET", "/api/v1/ai/stats", "AI Statistics"),
        
        # Authentication test
        ("POST", "/api/v1/citizen/token", "Login Test", {
            "username": "citizen@convergence.ma",
            "password": "citizen123"
        }),
    ]
    
    results = []
    passed = 0
    failed = 0
    
    for test in tests:
        if len(test) == 3:
            method, url, description = test
            data = None
        else:
            method, url, description, data = test
        
        full_url = f"{BASE_URL}{url}"
        print(f"\n🔍 Testing: {description}")
        print(f"   {method} {url}")
        
        result = test_endpoint(method, full_url, data)
        
        if "error" in result:
            print(f"   ❌ Error: {result['error']}")
            failed += 1
        elif result["success"]:
            print(f"   ✅ Success (Status: {result['status_code']})")
            if isinstance(result["data"], list):
                print(f"   📊 Returned {len(result['data'])} items")
            elif isinstance(result["data"], dict):
                print(f"   📊 Returned object with {len(result['data'])} fields")
            passed += 1
        else:
            print(f"   ❌ Failed (Status: {result['status_code']})")
            if isinstance(result["data"], dict) and "detail" in result["data"]:
                print(f"   📝 Error: {result['data']['detail']}")
            failed += 1
        
        results.append({
            "description": description,
            "method": method,
            "url": url,
            "result": result
        })
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary")
    print("=" * 50)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
    
    if failed == 0:
        print("\n🎉 All tests passed! The API is fully functional.")
    else:
        print(f"\n⚠️  {failed} test(s) failed. Check the errors above.")
    
    return results

def test_with_auth():
    """Test endpoints that require authentication."""
    print("\n🔐 Testing Authenticated Endpoints")
    print("=" * 50)
    
    # First, get a token
    login_data = {
        "username": "citizen@convergence.ma",
        "password": "citizen123"
    }
    
    login_result = test_endpoint("POST", f"{BASE_URL}/api/v1/citizen/token", login_data)
    
    if not login_result.get("success"):
        print("❌ Failed to get authentication token")
        return
    
    token = login_result["data"].get("access_token")
    if not token:
        print("❌ No access token in response")
        return
    
    print(f"✅ Got authentication token")
    
    # Test authenticated endpoints
    headers = {"Authorization": f"Bearer {token}"}
    
    auth_tests = [
        ("GET", "/api/v1/ai/history", "AI Query History"),
        ("POST", "/api/v1/citizen/reviews", "Submit Review", {
            "official_id": 1,
            "rating": 4.5,
            "title": "Test Review",
            "comment": "This is a test review from the API test script."
        }),
    ]
    
    for test in auth_tests:
        if len(test) == 3:
            method, url, description = test
            data = None
        else:
            method, url, description, data = test
        
        full_url = f"{BASE_URL}{url}"
        print(f"\n🔍 Testing: {description}")
        print(f"   {method} {url}")
        
        result = test_endpoint(method, full_url, data, headers)
        
        if "error" in result:
            print(f"   ❌ Error: {result['error']}")
        elif result["success"]:
            print(f"   ✅ Success (Status: {result['status_code']})")
        else:
            print(f"   ❌ Failed (Status: {result['status_code']})")
            if isinstance(result["data"], dict) and "detail" in result["data"]:
                print(f"   📝 Error: {result['data']['detail']}")

if __name__ == "__main__":
    print(f"🚀 Starting API tests at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Base URL: {BASE_URL}")
    
    # Run basic tests
    results = run_tests()
    
    # Run authenticated tests
    test_with_auth()
    
    print(f"\n🏁 Tests completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
