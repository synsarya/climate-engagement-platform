# Climate Data Service Backend

This backend service provides integration with the Copernicus Climate Data Store (CDS) API for downloading real ERA5 climate data to use in the Your Earth platform.

## Features

- **Real-time CDS API Integration**: Connect to Copernicus Climate Data Store
- **Background Task Processing**: Handle large data downloads asynchronously
- **Job Queue Management**: Track download progress and status
- **REST API Interface**: Clean API for frontend integration
- **File Management**: Automated download and file serving
- **Code Generation**: Generate CDS API Python code for requests

## Quick Start

### 1. Prerequisites

```bash
# Install Python dependencies
pip install flask cdsapi celery redis flask-cors

# Install and start Redis (for task queue)
# On macOS:
brew install redis
brew services start redis

# On Ubuntu:
sudo apt install redis-server
sudo systemctl start redis-server
```

### 2. Configure CDS API

1. Register at [Copernicus Climate Data Store](https://cds.climate.copernicus.eu/user/register)
2. Get your API key from your [profile page](https://cds.climate.copernicus.eu/user)
3. Create `~/.cdsapirc` file:

```
url: https://cds.climate.copernicus.eu/api/v2
key: {YOUR_UID}:{YOUR_API_KEY}
```

### 3. Start Services

```bash
# Terminal 1: Start Celery worker
celery -A cds-api-service.celery worker --loglevel=info

# Terminal 2: Start Flask API server
python cds-api-service.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```http
GET /api/health
```

### CDS Connection Status
```http
GET /api/cds/status
```

### Available Variables
```http
GET /api/era5/variables
```

### Submit Data Request
```http
POST /api/era5/request
Content-Type: application/json

{
  "dataset": "reanalysis-era5-single-levels",
  "variables": ["2m_temperature", "total_precipitation"],
  "dateStart": "2024-01-01",
  "dateEnd": "2024-01-31",
  "area": {
    "north": 90,
    "west": -180,
    "south": -90,
    "east": 180
  },
  "format": "netcdf",
  "productType": "reanalysis",
  "timeRange": ["00:00", "12:00"]
}
```

### Get All Jobs
```http
GET /api/jobs
```

### Get Job Status
```http
GET /api/jobs/{job_id}
```

### Download File
```http
GET /api/download/{job_id}
```

### Generate CDS Code
```http
POST /api/era5/generate-code
Content-Type: application/json

{
  "dataset": "reanalysis-era5-single-levels",
  "variables": ["2m_temperature"],
  "dateStart": "2024-01-01",
  "dateEnd": "2024-01-31",
  "area": {"north": 90, "west": -180, "south": -90, "east": 180},
  "format": "netcdf",
  "productType": "reanalysis"
}
```

## Frontend Integration

Update your React frontend to connect to the backend:

```typescript
// In ClimateDataService.tsx, replace mock functions with real API calls:

const API_BASE = 'http://localhost:5000/api';

const checkCDSConnection = async () => {
  const response = await fetch(`${API_BASE}/cds/status`);
  return response.json();
};

const submitDataRequest = async (requestData: ClimateDataRequest) => {
  const response = await fetch(`${API_BASE}/era5/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  return response.json();
};

const getJobs = async () => {
  const response = await fetch(`${API_BASE}/jobs`);
  return response.json();
};
```

## Available ERA5 Variables

### Temperature
- `2m_temperature`: 2 metre temperature
- `skin_temperature`: Skin temperature  
- `soil_temperature_level_1`: Soil temperature level 1

### Precipitation
- `total_precipitation`: Total precipitation
- `convective_precipitation`: Convective precipitation
- `precipitation_type`: Precipitation type

### Wind
- `10m_u_component_of_wind`: 10 metre U wind component
- `10m_v_component_of_wind`: 10 metre V wind component
- `100m_u_component_of_wind`: 100 metre U wind component
- `100m_v_component_of_wind`: 100 metre V wind component

### Pressure
- `surface_pressure`: Surface pressure
- `mean_sea_level_pressure`: Mean sea level pressure

### Humidity
- `2m_dewpoint_temperature`: 2 metre dewpoint temperature
- `relative_humidity`: Relative humidity

### Radiation
- `surface_solar_radiation_downwards`: Surface solar radiation downwards
- `surface_thermal_radiation_downwards`: Surface thermal radiation downwards

## Data Specifications

### ERA5 Reanalysis Dataset
- **Temporal Coverage**: 1979 to present (updated daily)
- **Temporal Resolution**: Hourly
- **Spatial Resolution**: ~31 km (0.25° × 0.25°)
- **Latency**: ~5 days behind real time
- **Format**: NetCDF, GRIB
- **Coordinate System**: Regular latitude-longitude grid

### Geographic Coverage
- **Global**: 90°N to 90°S, 180°W to 180°E
- **Custom Areas**: Specify bounding box coordinates
- **Resolution**: 0.25° × 0.25° (~31 km at equator)

## Example Requests

### Global Temperature Data
```python
import cdsapi

client = cdsapi.Client()
client.retrieve(
    'reanalysis-era5-single-levels',
    {
        'product_type': ['reanalysis'],
        'variable': ['2m_temperature'],
        'date': '2024-01-01/2024-01-31',
        'time': ['00:00', '12:00'],
        'area': [90, -180, -90, 180],
        'format': 'netcdf',
        'download_format': 'unarchived'
    },
    'temperature_2024_01.nc'
)
```

### Regional Precipitation Data
```python
import cdsapi

client = cdsapi.Client()
client.retrieve(
    'reanalysis-era5-single-levels',
    {
        'product_type': ['reanalysis'],
        'variable': ['total_precipitation'],
        'date': '2024-01-01/2024-12-31',
        'time': ['00:00'],
        'area': [50, -10, 35, 30],  # Europe
        'format': 'netcdf',
        'download_format': 'unarchived'
    },
    'precipitation_europe_2024.nc'
)
```

## Production Deployment

### Environment Variables
```bash
export SECRET_KEY="your-production-secret-key"
export REDIS_URL="redis://your-redis-server:6379/0"
export CDS_API_URL="https://cds.climate.copernicus.eu/api/v2"
export CDS_API_KEY="your-uid:your-api-key"
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "cds-api-service:app"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Error Handling

The service includes comprehensive error handling:

- **Authentication Errors**: Invalid CDS API credentials
- **Request Validation**: Missing or invalid parameters
- **Download Failures**: Network issues, quota limits
- **File Management**: Storage and serving errors

## Rate Limits & Quotas

CDS API has usage limits:
- **Request Rate**: Max 10 concurrent requests
- **Data Volume**: Varies by subscription level
- **Queue Time**: Can take hours for large requests

## Security Considerations

- **API Key Protection**: Never expose CDS API keys in frontend
- **File Access**: Implement proper access controls
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Implement API rate limiting

## Troubleshooting

### Common Issues

1. **CDS API Key Invalid**
   - Check `~/.cdsapirc` file format
   - Verify UID and API key from CDS profile

2. **Redis Connection Failed**
   - Ensure Redis server is running
   - Check Redis URL configuration

3. **Large Download Timeouts**
   - Increase request timeout limits
   - Implement download resume functionality

### Logs
```bash
# View Flask logs
tail -f /var/log/flask-app.log

# View Celery worker logs  
tail -f /var/log/celery-worker.log
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## License

This project is licensed under the MIT License.