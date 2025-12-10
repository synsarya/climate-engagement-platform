#!/usr/bin/env python3
"""
GRIB File Parser for Your Earth Platform
Handles parsing and analysis of GRIB meteorological data files

This script demonstrates how to parse the GRIB file:
6b909394d57791d45411e9d872774061.grib

Requirements:
- xarray
- cfgrib
- matplotlib
- numpy
- cartopy (optional, for advanced mapping)

Installation:
pip install xarray cfgrib matplotlib numpy cartopy
"""

import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import json
from datetime import datetime
import os

def parse_grib_file(filepath):
    """
    Parse a GRIB file and extract metadata and data arrays
    
    Args:
        filepath (str): Path to the GRIB file
        
    Returns:
        dict: Parsed data with metadata and arrays
    """
    try:
        # Open GRIB file with xarray and cfgrib
        ds = xr.open_dataset(filepath, engine='cfgrib')
        
        # Extract metadata
        metadata = {
            'filename': os.path.basename(filepath),
            'fileSize': f"{os.path.getsize(filepath) / (1024*1024):.1f} MB",
            'variables': [],
            'gridInfo': {},
            'timeInfo': {}
        }
        
        # Get grid information
        lats = ds.coords.get('latitude', ds.coords.get('lat', None))
        lons = ds.coords.get('longitude', ds.coords.get('lon', None))
        
        if lats is not None and lons is not None:
            metadata['gridInfo'] = {
                'resolution': f"{abs(float(lats[1] - lats[0])):.2f}° × {abs(float(lons[1] - lons[0])):.2f}°",
                'projection': 'Regular latitude-longitude',
                'extent': {
                    'north': float(lats.max()),
                    'south': float(lats.min()),
                    'east': float(lons.max()),
                    'west': float(lons.min())
                },
                'dimensions': {
                    'nx': len(lons),
                    'ny': len(lats)
                }
            }
        
        # Get time information
        times = ds.coords.get('time', ds.coords.get('valid_time', None))
        if times is not None:
            times_array = times.values
            metadata['timeInfo'] = {
                'startTime': str(times_array[0]) if len(times_array) > 0 else 'N/A',
                'endTime': str(times_array[-1]) if len(times_array) > 0 else 'N/A',
                'timeStep': '1 hour' if len(times_array) > 1 else 'Single time',
                'totalSteps': len(times_array)
            }
        
        # Process each variable
        for var_name, var_data in ds.data_vars.items():
            var_info = {
                'name': var_name,
                'description': var_data.attrs.get('long_name', var_name),
                'units': var_data.attrs.get('units', 'unknown'),
                'levels': list(var_data.coords.get('isobaricInhPa', [1000]).values) if 'isobaricInhPa' in var_data.coords else [1000],
                'timeSteps': len(times_array) if times is not None else 1,
                'dataRange': {
                    'min': float(var_data.min().values),
                    'max': float(var_data.max().values)
                },
                'shape': list(var_data.shape),
                'data': var_data.values.tolist() if var_data.size < 10000 else 'too_large'  # Only include small arrays
            }
            metadata['variables'].append(var_info)
        
        return {
            'success': True,
            'metadata': metadata,
            'dataset': ds,
            'raw_data': {var: ds[var].values for var in ds.data_vars}
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'metadata': None
        }

def extract_data_for_visualization(ds, variable, time_step=0, level=None):
    """
    Extract 2D data array for visualization
    
    Args:
        ds: xarray Dataset
        variable (str): Variable name
        time_step (int): Time step index
        level (float): Pressure level (if applicable)
        
    Returns:
        dict: Data array and coordinates for visualization
    """
    try:
        var_data = ds[variable]
        
        # Select time step
        if 'time' in var_data.dims:
            var_data = var_data.isel(time=time_step)
        elif 'valid_time' in var_data.dims:
            var_data = var_data.isel(valid_time=time_step)
        
        # Select level if applicable
        if level is not None and 'isobaricInhPa' in var_data.dims:
            var_data = var_data.sel(isobaricInhPa=level, method='nearest')
        
        # Get coordinates
        lats = var_data.coords.get('latitude', var_data.coords.get('lat'))
        lons = var_data.coords.get('longitude', var_data.coords.get('lon'))
        
        return {
            'success': True,
            'data': var_data.values,
            'lats': lats.values if lats is not None else None,
            'lons': lons.values if lons is not None else None,
            'units': var_data.attrs.get('units', ''),
            'description': var_data.attrs.get('long_name', variable)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def create_visualization(data_dict, output_path=None, colormap='viridis'):
    """
    Create a matplotlib visualization of the data
    
    Args:
        data_dict (dict): Data dictionary from extract_data_for_visualization
        output_path (str): Path to save the image (optional)
        colormap (str): Matplotlib colormap name
        
    Returns:
        str: Path to saved image or None
    """
    if not data_dict['success']:
        print(f"Error: {data_dict['error']}")
        return None
    
    try:
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Create the plot
        if data_dict['lats'] is not None and data_dict['lons'] is not None:
            im = ax.contourf(
                data_dict['lons'], 
                data_dict['lats'], 
                data_dict['data'],
                levels=20,
                cmap=colormap,
                extend='both'
            )
        else:
            im = ax.imshow(data_dict['data'], cmap=colormap, aspect='auto')
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax, shrink=0.7, pad=0.02)
        cbar.set_label(f"{data_dict['description']} ({data_dict['units']})")
        
        # Set labels and title
        ax.set_xlabel('Longitude')
        ax.set_ylabel('Latitude')
        ax.set_title(f"{data_dict['description']}")
        
        # Add grid
        ax.grid(True, alpha=0.3)
        
        # Save if output path provided
        if output_path:
            plt.savefig(output_path, dpi=300, bbox_inches='tight')
            print(f"Visualization saved to: {output_path}")
        
        plt.show()
        return output_path
        
    except Exception as e:
        print(f"Error creating visualization: {e}")
        return None

def analyze_grib_file(filepath):
    """
    Complete analysis of a GRIB file
    
    Args:
        filepath (str): Path to GRIB file
    """
    print(f"Analyzing GRIB file: {filepath}")
    print("=" * 50)
    
    # Parse the file
    result = parse_grib_file(filepath)
    
    if not result['success']:
        print(f"Error parsing file: {result['error']}")
        return
    
    metadata = result['metadata']
    ds = result['dataset']
    
    # Print metadata
    print(f"File: {metadata['filename']}")
    print(f"Size: {metadata['fileSize']}")
    print(f"Grid: {metadata['gridInfo']['resolution']} ({metadata['gridInfo']['dimensions']['nx']} × {metadata['gridInfo']['dimensions']['ny']})")
    print(f"Time: {metadata['timeInfo']['startTime']} to {metadata['timeInfo']['endTime']}")
    print(f"Variables: {len(metadata['variables'])}")
    print()
    
    # Print variables
    print("Variables:")
    for var in metadata['variables']:
        print(f"  - {var['name']}: {var['description']} ({var['units']})")
        print(f"    Range: {var['dataRange']['min']:.2f} to {var['dataRange']['max']:.2f}")
        print(f"    Shape: {var['shape']}")
        print()
    
    # Create visualizations for each variable
    for var in metadata['variables']:
        print(f"Creating visualization for {var['name']}...")
        
        # Extract data for first time step
        data_dict = extract_data_for_visualization(ds, var['name'], time_step=0)
        
        if data_dict['success']:
            output_path = f"{var['name']}_visualization.png"
            create_visualization(data_dict, output_path)
        else:
            print(f"Error extracting data for {var['name']}: {data_dict['error']}")
    
    # Save metadata as JSON
    metadata_path = f"{os.path.splitext(metadata['filename'])[0]}_metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2, default=str)
    
    print(f"Metadata saved to: {metadata_path}")

if __name__ == "__main__":
    # Example usage for your specific GRIB file
    grib_file = "6b909394d57791d45411e9d872774061.grib"
    
    # Check if file exists in current directory
    if os.path.exists(grib_file):
        analyze_grib_file(grib_file)
    else:
        print(f"GRIB file not found: {grib_file}")
        print("Please ensure the file is in the current directory or provide the full path.")
        
        # Example of how to use with a different path
        print("\nExample usage:")
        print(f"python {__file__} /path/to/your/grib/file.grib")

# Example API endpoint for Flask integration
def create_grib_api_endpoint():
    """
    Example Flask endpoint for GRIB file processing
    Add this to your cds-api-service.py
    """
    from flask import request, jsonify
    
    @app.route('/api/grib/parse', methods=['POST'])
    def parse_grib_endpoint():
        try:
            # Get uploaded file
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '' or not file.filename.endswith(('.grib', '.grib2')):
                return jsonify({'error': 'Invalid GRIB file'}), 400
            
            # Save uploaded file temporarily
            filepath = f"/tmp/{file.filename}"
            file.save(filepath)
            
            # Parse the file
            result = parse_grib_file(filepath)
            
            # Clean up
            os.remove(filepath)
            
            if result['success']:
                return jsonify({
                    'success': True,
                    'metadata': result['metadata']
                })
            else:
                return jsonify({
                    'success': False,
                    'error': result['error']
                }), 500
                
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/grib/extract', methods=['POST'])
    def extract_grib_data():
        """Extract specific variable/time data from GRIB file"""
        try:
            data = request.json
            filepath = data.get('filepath')
            variable = data.get('variable')
            time_step = data.get('timeStep', 0)
            level = data.get('level')
            
            # Open dataset
            ds = xr.open_dataset(filepath, engine='cfgrib')
            
            # Extract data
            result = extract_data_for_visualization(ds, variable, time_step, level)
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500