import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Upload, 
  Video, 
  Image, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  FileVideo,
  FileImage,
  Clock,
  HardDrive,
  Info,
  CheckCircle,
  X
} from "lucide-react";

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'video' | 'gif';
  name: string;
  size: string;
  duration?: number;
  dimensions?: { width: number; height: number };
  thumbnail?: string;
  uploadProgress: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

interface MediaUploaderProps {
  onMediaUploaded?: (files: MediaFile[]) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  showPreview?: boolean;
  category?: string;
}

export function MediaUploader({
  onMediaUploaded,
  maxFileSize = 100, // 100MB default
  acceptedTypes = ['.mp4', '.gif', '.webm', '.mov'],
  multiple = true,
  showPreview = true,
  category = 'general'
}: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaDimensions = (file: File): Promise<{ width: number; height: number; duration?: number }> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration
          });
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type === 'image/gif') {
        const img = document.createElement('img');
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  };

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.addEventListener('loadeddata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = 1; // Get frame at 1 second
        });
        
        video.addEventListener('seeked', () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          }
        });
        
        video.src = URL.createObjectURL(file);
      } else if (file.type === 'image/gif') {
        resolve(URL.createObjectURL(file));
      } else {
        reject('Unsupported file type for thumbnail');
      }
    });
  };

  const processFile = async (file: File): Promise<MediaFile> => {
    const fileId = generateFileId();
    const url = URL.createObjectURL(file);
    
    // Get dimensions and generate thumbnail
    const [dimensions, thumbnail] = await Promise.all([
      getMediaDimensions(file),
      generateThumbnail(file).catch(() => '')
    ]);

    return {
      id: fileId,
      file,
      url,
      type: file.type.startsWith('video/') ? 'video' : 'gif',
      name: file.name,
      size: formatFileSize(file.size),
      duration: dimensions.duration,
      dimensions: { width: dimensions.width, height: dimensions.height },
      thumbnail,
      uploadProgress: 0,
      status: 'uploading'
    };
  };

  const simulateUpload = async (mediaFile: MediaFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === mediaFile.id 
                ? { ...f, uploadProgress: 100, status: 'processing' }
                : f
            )
          );
          
          // Simulate processing time
          setTimeout(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === mediaFile.id 
                  ? { ...f, status: 'ready' }
                  : f
              )
            );
            resolve();
          }, 1000);
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === mediaFile.id 
                ? { ...f, uploadProgress: progress }
                : f
            )
          );
        }
      }, 200);
    });
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name}: File too large (max ${maxFileSize}MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Process files
      const mediaFiles = await Promise.all(
        validFiles.map(file => processFile(file))
      );

      // Add to state
      setUploadedFiles(prev => [...prev, ...mediaFiles]);

      // Simulate upload for each file
      await Promise.all(
        mediaFiles.map(mediaFile => simulateUpload(mediaFile))
      );

      // Notify parent component
      if (onMediaUploaded) {
        onMediaUploaded(mediaFiles);
      }

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [acceptedTypes, maxFileSize, onMediaUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
        if (fileToRemove.thumbnail) {
          URL.revokeObjectURL(fileToRemove.thumbnail);
        }
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const downloadFile = (mediaFile: MediaFile) => {
    const link = document.createElement('a');
    link.href = mediaFile.url;
    link.download = mediaFile.name;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Media Upload</span>
          </CardTitle>
          <CardDescription>
            Upload MP4 videos and GIF animations for climate education and community content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <Video className="h-8 w-8 text-muted-foreground" />
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-lg mb-2">
              {dragOver ? 'Drop your files here' : 'Drop media files here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports MP4, GIF, WebM, MOV • Max {maxFileSize}MB per file
            </p>
            <Button variant="outline" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Select Files'}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(',')}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files);
              }
            }}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uploaded Media ({uploadedFiles.length})</span>
              <Badge variant="secondary">
                {category}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((mediaFile) => (
                    <Card key={mediaFile.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {showPreview && mediaFile.status === 'ready' && (
                          <>
                            {mediaFile.type === 'video' ? (
                              <video
                                src={mediaFile.url}
                                className="w-full h-full object-cover"
                                controls
                                poster={mediaFile.thumbnail}
                              />
                            ) : (
                              <img
                                src={mediaFile.url}
                                alt={mediaFile.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </>
                        )}
                        
                        {mediaFile.thumbnail && mediaFile.status !== 'ready' && (
                          <img
                            src={mediaFile.thumbnail}
                            alt={`${mediaFile.name} thumbnail`}
                            className="w-full h-full object-cover opacity-50"
                          />
                        )}

                        {/* Status Overlay */}
                        <div className="absolute top-2 left-2">
                          {mediaFile.type === 'video' ? (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <FileVideo className="h-3 w-3" />
                              <span>Video</span>
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <FileImage className="h-3 w-3" />
                              <span>GIF</span>
                            </Badge>
                          )}
                        </div>

                        {/* Progress Overlay */}
                        {mediaFile.status !== 'ready' && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              {mediaFile.status === 'uploading' && (
                                <>
                                  <Upload className="h-8 w-8 mx-auto animate-pulse" />
                                  <Progress value={mediaFile.uploadProgress} className="w-32" />
                                  <p className="text-sm">Uploading... {Math.round(mediaFile.uploadProgress)}%</p>
                                </>
                              )}
                              {mediaFile.status === 'processing' && (
                                <>
                                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                  <p className="text-sm">Processing...</p>
                                </>
                              )}
                              {mediaFile.status === 'error' && (
                                <>
                                  <X className="h-8 w-8 mx-auto text-destructive" />
                                  <p className="text-sm text-destructive">Upload failed</p>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Success Overlay */}
                        {mediaFile.status === 'ready' && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium truncate" title={mediaFile.name}>
                            {mediaFile.name}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{mediaFile.size}</span>
                            </span>
                            {mediaFile.duration && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{Math.round(mediaFile.duration)}s</span>
                              </span>
                            )}
                          </div>
                          {mediaFile.dimensions && (
                            <div className="text-xs text-muted-foreground">
                              {mediaFile.dimensions.width} × {mediaFile.dimensions.height}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFile(mediaFile)}
                              disabled={mediaFile.status !== 'ready'}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFile(mediaFile.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="space-y-2">
                {uploadedFiles.map((mediaFile) => (
                  <Card key={mediaFile.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {mediaFile.type === 'video' ? (
                            <FileVideo className="h-10 w-10 text-muted-foreground" />
                          ) : (
                            <FileImage className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{mediaFile.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{mediaFile.size}</span>
                            {mediaFile.duration && <span>{Math.round(mediaFile.duration)}s</span>}
                            {mediaFile.dimensions && (
                              <span>{mediaFile.dimensions.width} × {mediaFile.dimensions.height}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {mediaFile.status === 'uploading' && (
                            <Progress value={mediaFile.uploadProgress} className="w-24" />
                          )}
                          {mediaFile.status === 'processing' && (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          )}
                          {mediaFile.status === 'ready' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {mediaFile.status === 'error' && (
                            <X className="h-5 w-5 text-destructive" />
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(mediaFile)}
                            disabled={mediaFile.status !== 'ready'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFile(mediaFile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Usage Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Supported formats:</strong> MP4, GIF, WebM, MOV • 
          <strong>Max file size:</strong> {maxFileSize}MB • 
          <strong>Recommended:</strong> MP4 for videos, GIF for short animations
        </AlertDescription>
      </Alert>
    </div>
  );
}