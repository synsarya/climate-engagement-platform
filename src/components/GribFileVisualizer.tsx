import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Upload, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  ZoomIn, 
  ZoomOut,
  Layers,
  Calendar,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  BarChart3,
  Info,
  Settings,
  Eye,
  EyeOff,
  Palette,
  Grid,
  Globe
} from "lucide-react";

interface GribMetadata {
  filename: string;
  fileSize: string;
  variables: Array<{
    name: string;
    description: string;
    units: string;
    levels: number[];
    timeSteps: number;
    dataRange: { min: number; max: number };
  }>;
  gridInfo: {
    resolution: string;
    projection: string;
    extent: { north: number; south: number; east: number; west: number };
    dimensions: { nx: number; ny: number };
  };
  timeInfo: {
    startTime: string;
    endTime: string;
    timeStep: string;
    totalSteps: number;
  };
}

interface GribVisualizationSettings {
  colormap: string;
  contourLevels: number;
  transparency: number;
  showGrid: boolean;
  showContours: boolean;
  smoothing: boolean;
}

export function GribFileVisualizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<GribMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVariable, setCurrentVariable] = useState<string>('');
  const [currentTimeStep, setCurrentTimeStep] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [visualization, setVisualization] = useState<GribVisualizationSettings>({
    colormap: 'viridis',
    contourLevels: 10,
    transparency: 0,
    showGrid: false,
    showContours: true,
    smoothing: true
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration (would be replaced with real GRIB parsing)
  const mockMetadata: GribMetadata = {
    filename: "6b909394d57791d45411e9d872774061.grib",
    fileSize: "245.7 MB",
    variables: [
      {
        name: "2t",
        description: "2 metre temperature",
        units: "K",
        levels: [1000],
        timeSteps: 24,
        dataRange: { min: 248.15, max: 308.45 }
      },
      {
        name: "tp",
        description: "Total precipitation",
        units: "m",
        levels: [1000],
        timeSteps: 24,
        dataRange: { min: 0, max: 0.025 }
      },
      {
        name: "10u",
        description: "10 metre U wind component",
        units: "m/s",
        levels: [1000],
        timeSteps: 24,
        dataRange: { min: -15.2, max: 18.7 }
      },
      {
        name: "10v",
        description: "10 metre V wind component",
        units: "m/s",
        levels: [1000],
        timeSteps: 24,
        dataRange: { min: -12.8, max: 16.3 }
      }
    ],
    gridInfo: {
      resolution: "0.25° × 0.25°",
      projection: "Regular latitude-longitude",
      extent: { north: 90, south: -90, east: 180, west: -180 },
      dimensions: { nx: 1440, ny: 721 }
    },
    timeInfo: {
      startTime: "2024-01-01 00:00 UTC",
      endTime: "2024-01-01 23:00 UTC", 
      timeStep: "1 hour",
      totalSteps: 24
    }
  };

  const colormaps = [
    { name: 'viridis', label: 'Viridis', description: 'Purple to yellow' },
    { name: 'plasma', label: 'Plasma', description: 'Purple to pink to yellow' },
    { name: 'coolwarm', label: 'Cool Warm', description: 'Blue to white to red' },
    { name: 'rainbow', label: 'Rainbow', description: 'Full spectrum' },
    { name: 'temperature', label: 'Temperature', description: 'Blue to red' },
    { name: 'precipitation', label: 'Precipitation', description: 'White to blue' }
  ];

  useEffect(() => {
    if (selectedFile) {
      loadGribFile(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (metadata && !currentVariable && metadata.variables.length > 0) {
      setCurrentVariable(metadata.variables[0].name);
    }
  }, [metadata]);

  useEffect(() => {
    if (isPlaying && metadata) {
      const interval = setInterval(() => {
        setCurrentTimeStep(prev => {
          const next = prev + 1;
          if (next >= metadata.timeInfo.totalSteps) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 1000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, metadata]);

  const loadGribFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would parse the GRIB file
      // Using libraries like python-xarray, pygrib, or eccodes
      setMetadata({
        ...mockMetadata,
        filename: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      
      renderVisualization();
    } catch (error) {
      console.error('Error loading GRIB file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.grib') || file.name.endsWith('.grib2'))) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid GRIB file (.grib or .grib2)');
    }
  };

  const renderVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !metadata) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw world map outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw mock data visualization based on current variable
    const currentVar = metadata.variables.find(v => v.name === currentVariable);
    if (!currentVar) return;

    // Generate mock data visualization
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        
        // Mock data generation based on variable type
        let value = 0;
        if (currentVar.name === '2t') {
          // Temperature pattern
          value = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 128 + 128;
        } else if (currentVar.name === 'tp') {
          // Precipitation pattern
          value = Math.random() * 100 + (Math.sin(currentTimeStep * 0.5) * 50);
        } else {
          // Wind pattern
          value = Math.sin((x + currentTimeStep * 10) * 0.02) * 128 + 128;
        }

        // Apply colormap
        const color = getColorFromValue(value / 255, visualization.colormap);
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255 - visualization.transparency;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw grid if enabled
    if (visualization.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 0.5;
      
      // Draw latitude lines
      for (let i = 0; i <= 180; i += 30) {
        const y = (i / 180) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw longitude lines
      for (let i = 0; i <= 360; i += 30) {
        const x = (i / 360) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    }

    // Draw contours if enabled
    if (visualization.showContours) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      
      for (let level = 0; level < visualization.contourLevels; level++) {
        const y = (level / visualization.contourLevels) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  };

  const getColorFromValue = (value: number, colormap: string) => {
    // Simple colormap implementation
    switch (colormap) {
      case 'viridis':
        return {
          r: Math.floor(value * 255 * 0.3),
          g: Math.floor(value * 255 * 0.7),
          b: Math.floor(255 - value * 255 * 0.3)
        };
      case 'coolwarm':
        return {
          r: Math.floor(value * 255),
          g: Math.floor(128 * (1 - Math.abs(value - 0.5) * 2)),
          b: Math.floor(255 * (1 - value))
        };
      case 'temperature':
        return {
          r: Math.floor(value * 255),
          g: Math.floor(value * 128),
          b: Math.floor(128 * (1 - value))
        };
      default:
        return { r: Math.floor(value * 255), g: Math.floor(value * 255), b: Math.floor(value * 255) };
    }
  };

  const downloadVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${currentVariable}_${currentTimeStep}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetView = () => {
    setCurrentTimeStep(0);
    setCurrentLevel(0);
    setIsPlaying(false);
    renderVisualization();
  };

  // Re-render when settings change
  useEffect(() => {
    if (metadata) {
      renderVisualization();
    }
  }, [currentVariable, currentTimeStep, currentLevel, visualization]);

  return (
    <div className="space-y-6">
      {/* File Upload */}
      {!selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload GRIB File</span>
            </CardTitle>
            <CardDescription>
              Upload your GRIB climate data file to visualize and analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-2">Drop your GRIB file here or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports .grib and .grib2 files up to 500MB
              </p>
              <Button variant="outline">
                Select File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".grib,.grib2"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Processing GRIB file...</p>
              <Progress value={75} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Visualization Interface */}
      {metadata && !isLoading && (
        <>
          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>{metadata.filename}</span>
                </div>
                <Badge variant="secondary">{metadata.fileSize}</Badge>
              </CardTitle>
              <CardDescription>
                {metadata.gridInfo.resolution} • {metadata.timeInfo.totalSteps} time steps • {metadata.variables.length} variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Time Range</div>
                  <div className="text-muted-foreground">
                    {metadata.timeInfo.startTime} - {metadata.timeInfo.endTime}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Grid Resolution</div>
                  <div className="text-muted-foreground">
                    {metadata.gridInfo.dimensions.nx} × {metadata.gridInfo.dimensions.ny} ({metadata.gridInfo.resolution})
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Coverage</div>
                  <div className="text-muted-foreground">
                    Global ({metadata.gridInfo.extent.west}° to {metadata.gridInfo.extent.east}°)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Visualization Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="variable" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="variable">Variable</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="variable" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Variable</label>
                    <Select value={currentVariable} onValueChange={setCurrentVariable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variable" />
                      </SelectTrigger>
                      <SelectContent>
                        {metadata.variables.map((variable) => (
                          <SelectItem key={variable.name} value={variable.name}>
                            <div className="flex items-center space-x-2">
                              {variable.name === '2t' && <Thermometer className="h-4 w-4" />}
                              {variable.name === 'tp' && <CloudRain className="h-4 w-4" />}
                              {(variable.name === '10u' || variable.name === '10v') && <Wind className="h-4 w-4" />}
                              <span>{variable.description} ({variable.units})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentVariable && (
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-sm">
                        <div className="font-medium mb-1">Data Range</div>
                        <div className="text-muted-foreground">
                          {metadata.variables.find(v => v.name === currentVariable)?.dataRange.min.toFixed(2)} - {' '}
                          {metadata.variables.find(v => v.name === currentVariable)?.dataRange.max.toFixed(2)} {' '}
                          {metadata.variables.find(v => v.name === currentVariable)?.units}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="time" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Time Step</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={resetView}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      value={[currentTimeStep]}
                      onValueChange={(value) => setCurrentTimeStep(value[0])}
                      max={metadata.timeInfo.totalSteps - 1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Step {currentTimeStep + 1} of {metadata.timeInfo.totalSteps}</span>
                      <span>{metadata.timeInfo.startTime}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Playback Speed</label>
                    <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color Map</label>
                    <Select value={visualization.colormap} onValueChange={(value) => 
                      setVisualization(prev => ({ ...prev, colormap: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colormaps.map((cm) => (
                          <SelectItem key={cm.name} value={cm.name}>
                            {cm.label} - {cm.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Transparency ({visualization.transparency}%)</label>
                    <Slider
                      value={[visualization.transparency]}
                      onValueChange={(value) => setVisualization(prev => ({ ...prev, transparency: value[0] }))}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Contour Levels</label>
                    <Slider
                      value={[visualization.contourLevels]}
                      onValueChange={(value) => setVisualization(prev => ({ ...prev, contourLevels: value[0] }))}
                      min={5}
                      max={20}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visualization.showGrid}
                        onChange={(e) => setVisualization(prev => ({ ...prev, showGrid: e.target.checked }))}
                      />
                      <span className="text-sm">Show Grid</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visualization.showContours}
                        onChange={(e) => setVisualization(prev => ({ ...prev, showContours: e.target.checked }))}
                      />
                      <span className="text-sm">Show Contours</span>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Visualization Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Data Visualization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={downloadVisualization}>
                    <Download className="h-4 w-4 mr-1" />
                    Export PNG
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border rounded w-full max-w-4xl mx-auto block"
                  style={{ aspectRatio: '2/1' }}
                />
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur p-3 rounded border space-y-1">
                  <div className="text-sm font-medium">
                    {metadata.variables.find(v => v.name === currentVariable)?.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Time: {metadata.timeInfo.startTime} + {currentTimeStep}h
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Units: {metadata.variables.find(v => v.name === currentVariable)?.units}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Data Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded">
                  <div className="text-sm text-muted-foreground">Min Value</div>
                  <div className="text-lg font-medium">
                    {metadata.variables.find(v => v.name === currentVariable)?.dataRange.min.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded">
                  <div className="text-sm text-muted-foreground">Max Value</div>
                  <div className="text-lg font-medium">
                    {metadata.variables.find(v => v.name === currentVariable)?.dataRange.max.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded">
                  <div className="text-sm text-muted-foreground">Grid Points</div>
                  <div className="text-lg font-medium">
                    {(metadata.gridInfo.dimensions.nx * metadata.gridInfo.dimensions.ny).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded">
                  <div className="text-sm text-muted-foreground">Time Steps</div>
                  <div className="text-lg font-medium">
                    {metadata.timeInfo.totalSteps}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This GRIB visualizer supports ERA5 and other meteorological data files. 
          For production use, integrate with libraries like xarray, pygrib, or eccodes for full GRIB parsing capabilities.
        </AlertDescription>
      </Alert>
    </div>
  );
}