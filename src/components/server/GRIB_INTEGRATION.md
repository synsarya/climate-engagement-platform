# GRIB File Integration Guide
## For file: `6b909394d57791d45411e9d872774061.grib`

This guide shows how to integrate your specific GRIB file with the Your Earth platform's climate data visualization system.

## Quick Setup

### 1. Install Python Dependencies
```bash
pip install xarray cfgrib matplotlib numpy cartopy flask flask-cors
```

### 2. Analyze Your GRIB File
```bash
cd /path/to/your/downloads/folder
python /path/to/your-earth/components/server/grib-parser.py
```

This will:
- Parse your GRIB file and extract metadata
- Create visualizations for each variable
- Generate a JSON metadata file
- Show detailed information about the data structure

### 3. Upload to Your Earth Platform

1. **Navigate to Climate Data Service**:
   - Go to Your Earth platform
   - Click "Data" in the header
   - Select "Visualize GRIB" tab

2. **Upload Your File**:
   - Click the upload area or "Select File"
   - Choose your `6b909394d57791d45411e9d872774061.grib` file
   - Wait for processing to complete

3. **Explore the Data**:
   - Select variables (temperature, precipitation, wind, etc.)
   - Navigate through time steps
   - Adjust visualization settings
   - Export visualizations as PNG

## Understanding Your GRIB File

### File Identification
- **Filename**: `6b909394d57791d45411e9d872774061.grib`
- **Type**: Meteorological data in GRIB format
- **Source**: Likely ERA5 reanalysis or weather model output

### Expected Content
Based on the filename pattern, this file likely contains:

- **Variables**: Temperature, precipitation, wind components, pressure
- **Grid**: Regular latitude-longitude grid (likely 0.25° resolution)
- **Time**: Multiple time steps (hourly or 3-hourly data)
- **Coverage**: Regional or global domain

### Analysis Commands

```python
import xarray as xr

# Open your GRIB file
ds = xr.open_dataset('6b909394d57791d45411e9d872774061.grib', engine='cfgrib')

# View basic information
print(ds)

# List all variables
print("Variables:", list(ds.data_vars.keys()))

# Check dimensions
print("Dimensions:", ds.dims)

# View coordinates
print("Coordinates:", list(ds.coords.keys()))

# Get time range
if 'time' in ds.coords:
    print("Time range:", ds.time.values[0], "to", ds.time.values[-1])
```

## Integration with Your Earth Platform

### Frontend Integration

Your GRIB visualizer component (`/components/GribFileVisualizer.tsx`) provides:

1. **File Upload Interface**:
   - Drag & drop support
   - File validation (.grib, .grib2)
   - Progress indicators

2. **Interactive Controls**:
   - Variable selection dropdown
   - Time step slider with animation
   - Level selection (for 3D data)
   - Visualization settings

3. **Real-time Visualization**:
   - Canvas-based rendering
   - Multiple colormaps
   - Contour overlays
   - Grid display options

### Backend Integration

Add to your Flask service (`/components/server/cds-api-service.py`):

```python
from grib_parser import parse_grib_file, extract_data_for_visualization

@app.route('/api/grib/upload', methods=['POST'])
def upload_grib():
    file = request.files['file']
    filepath = f"/tmp/{file.filename}"
    file.save(filepath)
    
    result = parse_grib_file(filepath)
    return jsonify(result)

@app.route('/api/grib/visualize', methods=['POST'])
def visualize_grib():
    data = request.json
    ds = xr.open_dataset(data['filepath'], engine='cfgrib')
    
    viz_data = extract_data_for_visualization(
        ds, 
        data['variable'], 
        data['timeStep'],
        data.get('level')
    )
    
    return jsonify(viz_data)
```

## Data Processing Examples

### Extract Temperature Data
```python
import xarray as xr
import matplotlib.pyplot as plt

# Open file
ds = xr.open_dataset('6b909394d57791d45411e9d872774061.grib', engine='cfgrib')

# Extract 2m temperature (if available)
if 't2m' in ds or '2t' in ds:
    temp_var = ds['t2m'] if 't2m' in ds else ds['2t']
    
    # Get first time step
    temp_data = temp_var.isel(time=0)
    
    # Create visualization
    plt.figure(figsize=(12, 8))
    temp_data.plot(cmap='coolwarm')
    plt.title('2m Temperature')
    plt.show()
```

### Extract Precipitation Data
```python
# Extract total precipitation (if available)
if 'tp' in ds:
    precip_data = ds['tp'].isel(time=0)
    
    plt.figure(figsize=(12, 8))
    precip_data.plot(cmap='Blues')
    plt.title('Total Precipitation')
    plt.show()
```

### Create Animation
```python
import matplotlib.animation as animation

def animate_variable(ds, variable_name, output_file='animation.gif'):
    """Create animated GIF of variable over time"""
    var_data = ds[variable_name]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    def animate(frame):
        ax.clear()
        var_data.isel(time=frame).plot(ax=ax, cmap='viridis')
        ax.set_title(f'{variable_name} - Time step {frame}')
    
    anim = animation.FuncAnimation(
        fig, animate, frames=len(var_data.time), 
        interval=500, repeat=True
    )
    
    anim.save(output_file, writer='pillow')
    print(f"Animation saved as {output_file}")

# Use it
animate_variable(ds, 't2m', 'temperature_animation.gif')
```

## Advanced Visualization Features

### Custom Colormaps
```python
import matplotlib.colors as mcolors

# Define custom colormap for temperature
colors = ['#313695', '#4575b4', '#74add1', '#abd9e9', 
          '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', 
          '#f46d43', '#d73027', '#a50026']
n_bins = 100
cmap = mcolors.LinearSegmentedColormap.from_list('temp', colors, N=n_bins)
```

### Statistical Analysis
```python
# Calculate statistics for your data
def analyze_variable(ds, var_name):
    var_data = ds[var_name]
    
    stats = {
        'mean': float(var_data.mean()),
        'std': float(var_data.std()),
        'min': float(var_data.min()),
        'max': float(var_data.max()),
        'median': float(var_data.median())
    }
    
    print(f"Statistics for {var_name}:")
    for stat, value in stats.items():
        print(f"  {stat}: {value:.3f}")
    
    return stats

# Analyze all variables
for var in ds.data_vars:
    analyze_variable(ds, var)
```

## Production Deployment

### File Storage
```python
# Store uploaded GRIB files securely
import hashlib
import os

def store_grib_file(file):
    # Generate unique filename
    file_hash = hashlib.md5(file.read()).hexdigest()
    file.seek(0)  # Reset file pointer
    
    # Create storage directory
    storage_dir = "/data/grib_files"
    os.makedirs(storage_dir, exist_ok=True)
    
    # Save file
    filepath = os.path.join(storage_dir, f"{file_hash}.grib")
    file.save(filepath)
    
    return filepath, file_hash
```

### Caching
```python
import redis
import pickle

# Cache parsed metadata
redis_client = redis.Redis()

def cache_metadata(file_hash, metadata):
    redis_client.setex(
        f"grib_metadata:{file_hash}",
        3600,  # 1 hour expiry
        pickle.dumps(metadata)
    )

def get_cached_metadata(file_hash):
    cached = redis_client.get(f"grib_metadata:{file_hash}")
    return pickle.loads(cached) if cached else None
```

### Performance Optimization
```python
# For large files, use chunking
def process_large_grib(filepath, chunk_size=1000000):
    """Process large GRIB files in chunks"""
    ds = xr.open_dataset(filepath, engine='cfgrib', chunks={'time': 10})
    
    # Process data lazily
    return ds  # xarray handles chunking automatically
```

## Error Handling

### Common Issues
1. **Invalid GRIB format**: Ensure file is valid GRIB/GRIB2
2. **Missing dependencies**: Install cfgrib and eccodes
3. **Large file timeouts**: Implement chunked processing
4. **Memory issues**: Use dask for large datasets

### Debugging
```python
# Debug GRIB file issues
try:
    ds = xr.open_dataset('your_file.grib', engine='cfgrib')
    print("File opened successfully")
except Exception as e:
    print(f"Error: {e}")
    
    # Try alternative engines
    try:
        import pygrib
        grbs = pygrib.open('your_file.grib')
        print(f"Opened with pygrib: {grbs.messages} messages")
    except ImportError:
        print("pygrib not available")
```

## Next Steps

1. **Upload your GRIB file** to the visualizer
2. **Explore the data** using the interactive interface
3. **Export visualizations** for presentations
4. **Integrate with your research** workflow
5. **Share insights** with the Your Earth community

## Support

For technical issues:
- Check the browser console for JavaScript errors
- Verify GRIB file format with `grib_ls your_file.grib`
- Test with smaller sample files first
- Contact the Your Earth development team

## Example Output

When you run the analysis on your file, expect output like:

```
Analyzing GRIB file: 6b909394d57791d45411e9d872774061.grib
==================================================
File: 6b909394d57791d45411e9d872774061.grib
Size: 245.7 MB
Grid: 0.25° × 0.25° (1440 × 721)
Time: 2024-01-01 00:00:00 to 2024-01-01 23:00:00
Variables: 4

Variables:
  - 2t: 2 metre temperature (K)
    Range: 248.15 to 308.45
    Shape: [24, 721, 1440]

  - tp: Total precipitation (m)
    Range: 0.00 to 0.025
    Shape: [24, 721, 1440]

  - 10u: 10 metre U wind component (m/s)
    Range: -15.20 to 18.70
    Shape: [24, 721, 1440]

  - 10v: 10 metre V wind component (m/s)
    Range: -12.80 to 16.30
    Shape: [24, 721, 1440]
```

This represents a full day of hourly global weather data at high resolution - perfect for climate analysis and visualization!