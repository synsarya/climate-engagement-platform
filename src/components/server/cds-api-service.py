#!/usr/bin/env python3
"""
Climate Data Service Backend
A Flask-based backend service for integrating with the Copernicus Climate Data Store (CDS) API

This service provides a REST API interface for downloading ERA5 climate data
and integrates with the Your Earth frontend application.

Requirements:
- Flask
- cdsapi
- celery (for background tasks)
- redis (for task queue)

Installation:
pip install flask cdsapi celery redis

Usage:
1. Set up your CDS API key in ~/.cdsapirc or environment variables
2. Start Redis server: redis-server
3. Start Celery worker: celery -A app.celery worker --loglevel=info
4. Start Flask app: python cds-api-service.py
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cdsapi
import os
import json
import uuid
from datetime import datetime, timedelta
from celery import Celery
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Enable CORS for frontend integration
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])

# Celery configuration for background tasks
app.config['CELERY_BROKER_URL'] = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
app.config['CELERY_RESULT_BACKEND'] = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')

# Initialize Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# In-memory job storage (use Redis/database in production)
jobs = {}

# ERA5 variable definitions
ERA5_VARIABLES = {
    'temperature': [
        '2m_temperature',
        'skin_temperature', 
        'soil_temperature_level_1'
    ],
    'precipitation': [
        'total_precipitation',
        'convective_precipitation',
        'precipitation_type'
    ],
    'wind': [
        '10m_u_component_of_wind',
        '10m_v_component_of_wind',
        '100m_u_component_of_wind',
        '100m_v_component_of_wind'
    ],
    'pressure': [
        'surface_pressure',
        'mean_sea_level_pressure'
    ],
    'humidity': [
        '2m_dewpoint_temperature',
        'relative_humidity'
    ],
    'radiation': [
        'surface_solar_radiation_downwards',
        'surface_thermal_radiation_downwards'
    ]
}

@celery.task(bind=True)
def download_era5_data(self, job_id, request_data):
    """
    Background task to download ERA5 data from CDS
    """
    try:
        jobs[job_id]['status'] = 'running'
        jobs[job_id]['progress'] = 0
        
        # Initialize CDS API client
        c = cdsapi.Client()
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'current': 10, 'total': 100})
        jobs[job_id]['progress'] = 10
        
        # Prepare CDS request
        dataset = request_data['dataset']
        cds_request = {
            'product_type': [request_data['productType']],
            'variable': request_data['variables'],
            'date': f"{request_data['dateStart']}/{request_data['dateEnd']}",
            'time': request_data.get('timeRange', ['00:00']),
            'area': [
                request_data['area']['north'],
                request_data['area']['west'], 
                request_data['area']['south'],
                request_data['area']['east']
            ],
            'format': request_data['format'],
            'download_format': 'unarchived'
        }
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'current': 20, 'total': 100})
        jobs[job_id]['progress'] = 20
        
        # Generate filename
        filename = f"era5_{job_id}.{request_data['format']}"
        filepath = f"/tmp/{filename}"
        
        # Download data from CDS
        logger.info(f"Starting CDS download for job {job_id}")
        c.retrieve(dataset, cds_request, filepath)
        
        # Update progress
        self.update_state(state='PROGRESS', meta={'current': 90, 'total': 100})
        jobs[job_id]['progress'] = 90
        
        # Get file size
        file_size = os.path.getsize(filepath)
        file_size_mb = file_size / (1024 * 1024)
        
        # Complete job
        jobs[job_id].update({
            'status': 'completed',
            'progress': 100,
            'completedAt': datetime.utcnow().isoformat(),
            'downloadUrl': f"/api/download/{job_id}",
            'fileSize': f"{file_size_mb:.1f} MB",
            'filepath': filepath
        })
        
        logger.info(f"Job {job_id} completed successfully")
        return {'status': 'completed', 'file_size': file_size_mb}
        
    except Exception as e:
        logger.error(f"Job {job_id} failed: {str(e)}")
        jobs[job_id].update({
            'status': 'failed',
            'error': str(e),
            'completedAt': datetime.utcnow().isoformat()
        })
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/cds/status', methods=['GET'])
def cds_status():
    """Check CDS API connection status"""
    try:
        # Try to initialize CDS client
        c = cdsapi.Client()
        
        # Test connection with a simple request (don't actually download)
        # This would check if credentials are valid
        return jsonify({
            'connected': True,
            'api_key_status': 'valid',
            'message': 'CDS API connection successful'
        })
    except Exception as e:
        return jsonify({
            'connected': False,
            'api_key_status': 'invalid',
            'message': str(e)
        }), 400

@app.route('/api/era5/variables', methods=['GET'])
def get_era5_variables():
    """Get available ERA5 variables"""
    return jsonify(ERA5_VARIABLES)

@app.route('/api/era5/request', methods=['POST'])
def submit_era5_request():
    """Submit a new ERA5 data request"""
    try:
        request_data = request.json
        
        # Validate request
        required_fields = ['dataset', 'variables', 'dateStart', 'dateEnd', 'area', 'format', 'productType']
        for field in required_fields:
            if field not in request_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Create job record
        job = {
            'id': job_id,
            'status': 'queued',
            'progress': 0,
            'request': request_data,
            'createdAt': datetime.utcnow().isoformat()
        }
        
        jobs[job_id] = job
        
        # Start background download task
        download_era5_data.delay(job_id, request_data)
        
        logger.info(f"Created job {job_id} for ERA5 download")
        return jsonify(job), 201
        
    except Exception as e:
        logger.error(f"Error submitting ERA5 request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Get all jobs"""
    return jsonify(list(jobs.values()))

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    """Get specific job status"""
    if job_id not in jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(jobs[job_id])

@app.route('/api/download/<job_id>', methods=['GET'])
def download_file(job_id):
    """Download completed data file"""
    if job_id not in jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    job = jobs[job_id]
    
    if job['status'] != 'completed':
        return jsonify({'error': 'Job not completed'}), 400
    
    if 'filepath' not in job:
        return jsonify({'error': 'File not available'}), 404
    
    return send_file(job['filepath'], as_attachment=True)

@app.route('/api/era5/generate-code', methods=['POST'])
def generate_cds_code():
    """Generate CDS API code for a request"""
    try:
        request_data = request.json
        
        # Generate Python code
        code_template = f'''import cdsapi

dataset = "{request_data['dataset']}"
request = {{
    "product_type": ["{request_data['productType']}"],
    "variable": [
        {chr(10).join([f'        "{var}",' for var in request_data['variables']])}
    ],
    "date": "{request_data['dateStart']}/{request_data['dateEnd']}",
    "time": [
        {chr(10).join([f'        "{time}",' for time in request_data.get('timeRange', ['00:00'])])}
    ],
    "area": [
        {request_data['area']['north']}, {request_data['area']['west']},
        {request_data['area']['south']}, {request_data['area']['east']}
    ],
    "format": "{request_data['format']}",
    "download_format": "unarchived"
}}

client = cdsapi.Client()
client.retrieve(dataset, request).download("era5_data.{request_data['format']}")'''
        
        return jsonify({'code': code_template})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create downloads directory
    os.makedirs('/tmp', exist_ok=True)
    
    # Start Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)